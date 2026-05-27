"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import { Icon } from "@iconify/react";
import { googleCallback } from "@/lib/official-portal-api";
import { useAuth } from "@/contexts/AuthContext";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [failed, setFailed] = useState(false);
  const { setAccessToken, refreshProfile } = useAuth();

  useEffect(() => {
    if (code && !failed) {
      googleCallback(code)
        .then((tokens) => {
          if (tokens.access_token && tokens.access_token_exp) {
            setAccessToken(tokens.access_token, tokens.access_token_exp);
            refreshProfile();
          }
          router.push("/products");
        })
        .catch(() => setFailed(true));
    }
  }, [code, failed, setAccessToken, refreshProfile, router]);

  if (failed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Icon icon="mdi:alert-circle" className="size-12 text-destructive" />
        <p className="text-lg font-medium">Login failed</p>
      </div>
    );
  }

  return <Loading />;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}