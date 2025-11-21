"use client";

import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import {
  createChat,
  fetchChats,
  fetchMessages,
  sendMessage,
} from "@/services/chat";
import { Chat, Message, getChatId } from "@/types/chat";

type ChatState = {
  chats: Chat[];
  currentChatId: string | null;
  messages: Record<string, Message[]>;
  loadingChats: boolean;
  loadingMessages: boolean;
  sending: boolean;
  error: string | null;
  hasInitialized: boolean;
};

type ChatAction =
  | { type: "SET_CHATS"; payload: Chat[] }
  | { type: "SET_CURRENT_CHAT"; payload: string | null }
  | { type: "SET_MESSAGES"; payload: { chatId: string; messages: Message[] } }
  | { type: "ADD_MESSAGES"; payload: { chatId: string; messages: Message[] } }
  | { type: "ADD_CHAT"; payload: Chat }
  | { type: "ADD_MESSAGE"; payload: { chatId: string; message: Message } }
  | { type: "SET_LOADING_CHATS"; payload: boolean }
  | { type: "SET_LOADING_MESSAGES"; payload: boolean }
  | { type: "SET_SENDING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_INITIALIZED"; payload: boolean };

const initialState: ChatState = {
  chats: [],
  currentChatId: null,
  messages: {},
  loadingChats: false,
  loadingMessages: false,
  sending: false,
  error: null,
  hasInitialized: false,
};

function reducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_CHATS":
      return { ...state, chats: action.payload ?? [] };
    case "SET_CURRENT_CHAT":
      return { ...state, currentChatId: action.payload };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: action.payload.messages,
        },
      };
    case "ADD_MESSAGES": {
      const existingMessages = state.messages[action.payload.chatId] ?? [];
      const sanitizedExisting = existingMessages.filter((message) => {
        if (!message._id?.startsWith("temp-")) return true;
        return !action.payload.messages.some(
          (incoming) =>
            incoming.role === message.role && incoming.content === message.content,
        );
      });
      const merged = [
        ...sanitizedExisting,
        ...action.payload.messages.filter((message) => message._id),
      ];
      const unique = Array.from(
        new Map(
          merged.map((message) => [
            message._id ?? message.id ?? `temp-${Date.now()}-${Math.random()}`,
            message,
          ]),
        ).values(),
      );
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: unique,
        },
      };
    }
    case "ADD_CHAT":
      return { ...state, chats: [action.payload, ...(state.chats ?? [])] };
    case "ADD_MESSAGE": {
      const currentMessages = state.messages[action.payload.chatId] ?? [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: [...currentMessages, action.payload.message],
        },
      };
    }
    case "SET_LOADING_CHATS":
      return { ...state, loadingChats: action.payload };
    case "SET_LOADING_MESSAGES":
      return { ...state, loadingMessages: action.payload };
    case "SET_SENDING":
      return { ...state, sending: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_INITIALIZED":
      return { ...state, hasInitialized: action.payload };
    default:
      return state;
  }
}

type ChatContextValue = ChatState & {
  dispatch: Dispatch<ChatAction>;
  refreshChats: () => Promise<void>;
  selectChat: (chatId: string, options?: { force?: boolean }) => Promise<void>;
  startChat: (initialPrompt?: string) => Promise<void>;
  sendPrompt: (content: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refreshChats = useCallback(async () => {
    dispatch({ type: "SET_LOADING_CHATS", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const data = await fetchChats();
      dispatch({ type: "SET_CHATS", payload: data });
      dispatch({ type: "SET_INITIALIZED", payload: true });
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error?.data?.message ??
          error?.response?.data?.message ??
          "Unable to load chats.",
      });
    } finally {
      dispatch({ type: "SET_LOADING_CHATS", payload: false });
    }
  }, []);

  const selectChat = useCallback(
    async (chatId: string, options?: { force?: boolean }) => {
      if (!chatId) return;
      dispatch({ type: "SET_CURRENT_CHAT", payload: chatId });
      if (state.messages[chatId] && !options?.force) return;

      dispatch({ type: "SET_LOADING_MESSAGES", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      try {
        const data = await fetchMessages(chatId);
        dispatch({
          type: "SET_MESSAGES",
          payload: { chatId, messages: data },
        });
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload:
            error?.data?.message ??
            error?.response?.data?.message ??
            "Unable to load messages.",
        });
      } finally {
        dispatch({ type: "SET_LOADING_MESSAGES", payload: false });
      }
    },
    [state.messages],
  );

  const startChat = useCallback(
    async (initialPrompt?: string) => {
      dispatch({ type: "SET_SENDING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      try {
        const newIndex = (state.chats?.length ?? 0) + 1;
        const baseTitle = initialPrompt?.slice(0, 80)?.trim();
        const generatedTitle = baseTitle?.length
          ? baseTitle
          : `New Chat ${newIndex}`;
        const chat = await createChat({
          title: generatedTitle,
          message: initialPrompt,
        });
        if (!chat) {
          throw new Error("Unable to create chat");
        }
        const newlyCreatedId = getChatId(chat);
        dispatch({ type: "ADD_CHAT", payload: chat });
        dispatch({ type: "SET_CURRENT_CHAT", payload: newlyCreatedId });
        if (initialPrompt) {
          await selectChat(newlyCreatedId);
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload:
            error?.data?.message ??
            error?.response?.data?.message ??
            "Unable to start chat.",
        });
      } finally {
        dispatch({ type: "SET_SENDING", payload: false });
      }
    },
    [selectChat, state.chats?.length],
  );

  const sendPrompt = useCallback(
    async (content: string) => {
      const chatId = state.currentChatId;
      if (!chatId) {
        await startChat(content);
        return;
      }
      dispatch({ type: "SET_SENDING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      const userMessage: Message = {
        _id: `temp-${Date.now()}`,
        chat: chatId,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_MESSAGE", payload: { chatId, message: userMessage } });
      try {
        const response = await sendMessage({ chatId, content });
        if (response.messages.length) {
          dispatch({
            type: "ADD_MESSAGES",
            payload: { chatId, messages: response.messages },
          });
        }
        await refreshChats();
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload:
            error?.data?.message ??
            error?.response?.data?.message ??
            "Unable to send message.",
        });
      } finally {
        dispatch({ type: "SET_SENDING", payload: false });
      }
    },
    [refreshChats, startChat, state.currentChatId],
  );

  useEffect(() => {
    refreshChats();
  }, [refreshChats]);

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
      refreshChats,
      selectChat,
      startChat,
      sendPrompt,
    }),
    [state, refreshChats, selectChat, startChat, sendPrompt],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};

