"use client";

import Image from "next/image";
import { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  helperSlot?: ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  children,
  helperSlot,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row">
        <div className="flex flex-1 flex-col gap-10">
          <div className="flex items-center gap-3">
            <Image
              src="/colored-logo.svg"
              alt="TuringTech Test"
              width={56}
              height={56}
              className="h-12 w-12"
              priority
            />
            <p className="text-2xl font-semibold">TuringTech Test</p>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/70 p-8 shadow-[0_0_60px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="mb-8 space-y-2">
              <p className="text-lg text-white/80">{subtitle}</p>
              <h1 className="text-2xl font-semibold text-white">{title}</h1>
            </div>
            {children}
            {helperSlot ? <div className="mt-8 text-sm">{helperSlot}</div> : null}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center rounded-[32px] border border-white/5 bg-[#141414] p-10">
          <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-[#1f1f1f]">
            <Image
              src="/colored-logo.svg"
              alt="TuringTech"
              width={160}
              height={160}
              className="h-40 w-40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

