"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { useChatContext } from "@/context/ChatContext";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatHistorySidebar } from "@/components/chat/ChatHistorySidebar";
import { MessageList } from "@/components/chat/MessageList";
import { getChatId } from "@/types/chat";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const chatIdFromQuery = searchParams.get("chat");

  const {
    currentChatId,
    chats,
    loadingChats,
    refreshChats,
    error,
    hasInitialized,
    selectChat,
  } = useChatContext();

  const safeChats = (chats ?? []).filter(Boolean);

  const currentChat = useMemo(
    () => safeChats.find((chat) => getChatId(chat) === currentChatId),
    [safeChats, currentChatId],
  );

  useEffect(() => {
    if (!chatIdFromQuery) return;
    if (chatIdFromQuery === currentChatId) return;
    selectChat(chatIdFromQuery);
  }, [chatIdFromQuery, currentChatId, selectChat]);

  return (
    <div className="flex h-screen bg-[#090909] text-white">
      <ChatHistorySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-white/5 px-8 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              TuringTech Spaces
            </p>
            <h1 className="text-2xl font-semibold text-white">
              {currentChat?.title ?? "New Conversation"}
            </h1>
          </div>
          <button
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:text-white"
            onClick={refreshChats}
            disabled={loadingChats}
          >
            Refresh
          </button>
        </header>

        <main className="relative flex flex-1 flex-col gap-4 overflow-hidden px-6 py-6">
          {error ? (
            <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          {hasInitialized && !currentChatId ? (
            <ChatEmptyState />
          ) : currentChatId ? (
            <div className="flex flex-1 flex-col gap-6 overflow-hidden">
              <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#0e0e0e]/60 px-6 py-4 min-h-[60vh] max-h-[80vh]">
                <MessageList />
              </div>
              <div className="mx-auto w-full max-w-4xl shrink-0">
                <ChatComposer />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <Image
                src="/colored-logo.svg"
                alt="TuringTech"
                width={96}
                height={96}
                className="animate-pulse opacity-60"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

