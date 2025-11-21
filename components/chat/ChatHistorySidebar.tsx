"use client";

import clsx from "clsx";
import {
  Clock4,
  Command,
  Layers2,
  PlusSquare,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useChatContext } from "@/context/ChatContext";
import { AuthStorage } from "@/lib/authStorage";
import { Chat, getChatId } from "@/types/chat";

const navItems = [
  { label: "New chat", icon: PlusSquare, action: "new" },
  { label: "Quick Actions", icon: Command, action: "static" },
  { label: "Spaces", icon: Layers2, action: "static" },
];

function ChatListItem({
  chat,
  isActive,
  onSelect,
}: {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={clsx(
        "w-full rounded-2xl px-4 py-3 text-left text-sm transition",
        isActive
          ? "bg-white/10 text-white shadow-[0_0_25px_rgba(0,0,0,0.35)]"
          : "text-white/70 hover:bg-white/5 hover:text-white",
      )}
    >
      <p className="font-medium line-clamp-1">{chat.title || "Untitled chat"}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-white/40">
        <Clock4 size={12} />
        {(() => {
          const dateString = chat.updatedAt ?? chat.createdAt;
          if (!dateString) return "—";
          const parsed = new Date(dateString);
          return Number.isNaN(parsed.getTime())
            ? "—"
            : parsed.toLocaleString();
        })()}
      </p>
    </button>
  );
}

export function ChatHistorySidebar() {
  const {
    chats,
    currentChatId,
    selectChat,
    startChat,
    loadingChats,
    error,
    hasInitialized,
  } = useChatContext();
  const safeChats = (chats ?? []).filter(Boolean);
  const [email, setEmail] = useState("johnsmith@gmail.com");

  useEffect(() => {
    const storedEmail = AuthStorage.getUserEmail();
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleCreateChat = () => {
    startChat();
  };

  return (
    <div className="hidden w-72 flex-col border-r border-white/5 bg-[#050505]/90 text-white md:flex">
      <div className="flex items-center gap-3 border-b border-white/5 px-6 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <Image src="/white-logo.svg" width={28} height={28} alt="Logo" />
        </div>
        <div>
          <p className="text-sm font-semibold">TuringTech</p>
          <p className="text-xs text-white/50">Spaces</p>
        </div>
      </div>

      <nav className="space-y-2 px-6 py-4">
        {navItems.map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            onClick={action === "new" ? handleCreateChat : undefined}
            disabled={action === "new" && loadingChats}
            className={clsx(
              "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
              action === "new"
                ? "bg-white text-black font-medium shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                : "text-white/70 hover:text-white hover:bg-white/5",
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
          Chat History
        </p>
        <div className="mt-4 space-y-2">
          {loadingChats && !hasInitialized ? (
            <p className="text-sm text-white/50">Loading chats...</p>
          ) : safeChats.length ? (
            safeChats.map((chat) => (
              <ChatListItem
                key={getChatId(chat)}
                chat={chat}
                isActive={getChatId(chat) === currentChatId}
                onSelect={() => selectChat(getChatId(chat))}
              />
            ))
          ) : (
            <p className="text-sm text-white/50">
              No chats yet. Start a new conversation!
            </p>
          )}
        </div>
        {error ? (
          <p className="mt-4 text-xs text-red-400">{error}</p>
        ) : null}
      </div>

      <div className="mt-auto border-t border-white/5 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
            <UserRound size={18} />
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">{email}</p>
            <p className="text-xs text-white/40">Logged in</p>
          </div>
        </div>
      </div>
    </div>
  );
}

