"use client";

import { Logo } from "@/components/pages/logo/Logo";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="animate-spin">
        <Logo className="w-16 h-16" />
      </div>
      <span className="font-mono text-sm text-gray-500 tracking-wider">
        Loading...
      </span>
    </div>
  );
}