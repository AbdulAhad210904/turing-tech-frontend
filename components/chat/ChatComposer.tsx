"use client";

import { FormEvent, useState } from "react";
import { ArrowUp } from "lucide-react";

import { useChatContext } from "@/context/ChatContext";

export function ChatComposer() {
  const { sendPrompt, sending } = useChatContext();
  const [value, setValue] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim() || sending) return;
    const prompt = value.trim();
    setValue("");
    await sendPrompt(prompt);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center rounded-3xl border border-white/10 bg-black/60 px-4 py-3 shadow-inner shadow-black/50"
    >
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask something..."
        className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
        disabled={sending}
      />
      <button
        type="submit"
        disabled={!value.trim() || sending}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ArrowUp size={18} />
      </button>
    </form>
  );
}

