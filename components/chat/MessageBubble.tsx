"use client";

import clsx from "clsx";

import { Message } from "@/types/chat";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const createdAt = message.createdAt ? new Date(message.createdAt) : null;
  const timestamp = createdAt && !isNaN(createdAt.getTime())
    ? createdAt.toLocaleTimeString()
    : "—";
  return (
    <div
      className={clsx(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={clsx(
          "max-w-2xl rounded-3xl px-6 py-4 text-sm leading-relaxed",
          isUser
            ? "bg-white text-black"
            : "border border-white/10 bg-white/5 text-white",
        )}
      >
        <p>{message.content}</p>
        <span className="mt-2 block text-xs text-white/40">{timestamp}</span>
      </div>
    </div>
  );
}

