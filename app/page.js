"use client"

import { redirect } from "next/navigation";
import { useEffect } from "react";
import 'dotenv/config';

export default function Home() {
  useEffect(() => {
    redirect("/auth");
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>You will be redirected...</p>
    </div>
  );
}
