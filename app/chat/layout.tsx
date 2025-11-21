import { ReactNode } from "react";

import AuthGuard from "@/components/auth/AuthGuard";
import { ChatProvider } from "@/context/ChatContext";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <ChatProvider>{children}</ChatProvider>
    </AuthGuard>
  );
}

