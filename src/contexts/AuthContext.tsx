"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { startTransition } from "react";
import { getProfile, ProfileResponse, getAccessToken, setAccessToken as saveAccessToken, clearAccessToken as removeAccessToken, refreshToken as refreshTokenApi } from "@/lib/official-portal-api";

interface AuthContextType {
  isAuthenticated: boolean;
  profile: ProfileResponse | null;
  setAccessToken: (token: string, exp: number) => void;
  clearAccessToken: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  const isAuthenticated = !!profile;

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      refreshTokenApi()
        .then((data) => {
          saveAccessToken(data.access_token, data.access_token_exp);
          return getProfile();
        })
        .then((data) => {
          startTransition(() => {
            setProfile(data);
          });
        })
        .catch(() => {
          removeAccessToken();
        });
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profileData = await getProfile();
      startTransition(() => {
        setProfile(profileData);
      });
    } catch {
      startTransition(() => {
        setProfile(null);
      });
    }
  }, []);

  const setAccessToken = useCallback((token: string, exp: number) => {
    saveAccessToken(token, exp);
    getProfile()
      .then((data) => {
        startTransition(() => {
          setProfile(data);
        });
      })
      .catch(() => {
        startTransition(() => {
          setProfile(null);
        });
      });
  }, []);

  const clearAccessToken = useCallback(() => {
    removeAccessToken();
    startTransition(() => {
      setProfile(null);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        profile,
        setAccessToken,
        clearAccessToken,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}