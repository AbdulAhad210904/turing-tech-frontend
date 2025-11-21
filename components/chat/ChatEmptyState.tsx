"use client";

import Image from "next/image";

import { ChatComposer } from "./ChatComposer";

export function ChatEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <Image
        src="/colored-logo.svg"
        alt="TuringTech"
        width={120}
        height={120}
        className="opacity-80"
      />
      <div className="max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-white">
          Ask something to get started
        </h2>
        <p className="mt-2 text-white/60">
          Explore recent market trends, analyze documents, or request a custom
          report using the search below.
        </p>
      </div>
      <div className="w-full max-w-2xl">
        <ChatComposer />
      </div>
    </div>
  );
}

