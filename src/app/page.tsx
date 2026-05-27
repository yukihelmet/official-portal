"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push("/products");
  //   }, 100);
  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="font-oswald text-5xl font-bold">Yuki Helmet</h1>
    </div>
  );
}