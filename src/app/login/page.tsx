"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { googleLogin } from "@/lib/official-portal-api";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      const url = await googleLogin();
      window.location.href = url;
    } catch {
      router.push("/?error=login_failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-sm rounded-none border-none">
        <CardContent className="flex flex-col items-center gap-6 pt-6">
          <Image src="/logo.svg" alt="Yuki Helmet" width={64} height={64} />
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-heading font-bold text-primary">Yuki Helmet</h1>
            <p className="text-sm text-muted-foreground">
              - {t.common.signInToContinue} -
            </p>
          </div>
          <div className="h-0.5 w-full bg-primary"></div>
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2 rounded border-primary hover:bg-white hover:text-primary cursor-pointer"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Icon icon="mdi:google" className="size-5" />
            {isLoading ? "Redirecting..." : "Continue with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}