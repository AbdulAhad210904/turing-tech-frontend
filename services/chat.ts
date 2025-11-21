import axiosInstance from "@/lib/axiosInstance";
import {
  Chat,
  CreateChatPayload,
  Message,
  SendMessagePayload,
  ensureChatId,
  ensureMessageId,
} from "@/types/chat";

type ChatsResponse = { status: number; chats?: Chat[]; data?: Chat[] };
type ChatResponse = { status: number; chat?: Chat; data?: Chat };
type MessagesResponse = {
  status: number;
  messages?: Message[];
  data?: Message[];
};
type MessageResponse = {
  status: number;
  message?: Message | Message[];
  data?: Message | Message[];
  messages?: Message[];
  chat?: Chat;
};

const normalizeChats = (payload?: Chat[]) =>
  (payload ?? []).map((chat) => ensureChatId(chat));

export const fetchChats = async () => {
  const response = await axiosInstance.get<ChatsResponse>("/chats");
  const chats = response.data.chats ?? response.data.data ?? [];
  return normalizeChats(chats);
};

export const createChat = async (payload: CreateChatPayload) => {
  const response = await axiosInstance.post<ChatResponse>("/chats", payload);
  const chat = response.data.chat ?? response.data.data;
  return chat ? ensureChatId(chat) : null;
};

export const fetchMessages = async (chatId: string) => {
  const response = await axiosInstance.get<MessagesResponse>(
    `/chats/${chatId}/messages`,
  );
  const messages = response.data.messages ?? response.data.data ?? [];
  return messages.map((message) => ensureMessageId(message));
};

export const sendMessage = async ({ chatId, content }: SendMessagePayload) => {
  const response = await axiosInstance.post<MessageResponse>(
    `/chats/${chatId}/messages`,
    { content },
  );

  const rawMessages =
    response.data.messages ?? response.data.message ?? response.data.data;

  const messageArray = Array.isArray(rawMessages)
    ? rawMessages
    : rawMessages
      ? [rawMessages]
      : [];

  const normalizedMessages = messageArray.map((message) =>
    ensureMessageId(message),
  );

  const chat = response.data.chat ? ensureChatId(response.data.chat) : null;

  return { chat, messages: normalizedMessages };
};

