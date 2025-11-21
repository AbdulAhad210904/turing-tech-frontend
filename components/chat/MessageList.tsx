"use client";

import { useMemo } from "react";

import { useChatContext } from "@/context/ChatContext";
import { getMessageId } from "@/types/chat";

import { MessageBubble } from "./MessageBubble";

export function MessageList() {
  const { messages, currentChatId, loadingMessages, sending } = useChatContext();

  const chatMessages = useMemo(
    () => (currentChatId ? messages[currentChatId] ?? [] : []),
    [messages, currentChatId],
  );

  if (loadingMessages) {
    return (
      <div className="flex flex-1 items-center justify-center text-white/60">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-6 min-h-0 max-h-full">
      {chatMessages.map((message) => (
        <MessageBubble key={getMessageId(message)} message={message} />
      ))}
      {sending ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70">
          TuringTech is crafting a response...
        </div>
      ) : null}
    </div>
  );
}

