"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "/products";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/yukihelmet.svg" alt="結城安全帽" className="w-full max-w-3xl" />
      <span className="text-gray-400 text-sm mt-2 animate-pulse">載入中...</span>
    </div>
  );
}