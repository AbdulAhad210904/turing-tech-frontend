export type Chat = {
  _id?: string;
  id?: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  _id?: string;
  id?: string;
  chat: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type CreateChatPayload = {
  title?: string;
  message?: string;
};

export type SendMessagePayload = {
  chatId: string;
  content: string;
};

export const ensureChatId = (chat: Chat): Chat => ({
  ...chat,
  _id: chat._id ?? chat.id ?? "",
});

export const ensureMessageId = (message: Message): Message => ({
  ...message,
  _id: message._id ?? message.id ?? "",
});

export const getChatId = (chat?: Chat | null) =>
  chat ? chat._id ?? chat.id ?? "" : "";

export const getMessageId = (message?: Message | null) =>
  message ? message._id ?? message.id ?? "" : "";

