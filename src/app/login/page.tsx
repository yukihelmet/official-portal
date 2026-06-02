"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { auth0Login } from "@/lib/official-portal-api";
import { Logo } from "@/components/pages/logo/Logo";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  async function handleAuth0Login() {
    setIsLoading(true);
    try {
      const url = await auth0Login();
      window.location.href = url;
    } catch {
      router.push("/?error=login_failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-sm rounded-none border-none">
        <CardContent className="flex flex-col items-center gap-6 pt-6">
          <div className="flex items-center gap-2">
            <Logo className="w-10 h-10 scale-x-[-1]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/yukihelmet.svg" alt="結城安全帽" className="h-10 w-auto" />
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              - {t("common.signInToContinue")} -
            </p>
          </div>
          <div className="h-0.5 w-full bg-primary"></div>
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2 rounded border-primary hover:bg-white hover:text-primary cursor-pointer"
            onClick={handleAuth0Login}
            disabled={isLoading}
          >
            {isLoading ? "Redirecting..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}