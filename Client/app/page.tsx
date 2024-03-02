"use client"

import { Chat } from "@/components/home/chat";
import useAuthentication from "@/lib/hooks/useAuthentication";

export default function Home() {
  useAuthentication();
  const id = "n2BG6EzVIyZmLE2G7YuM";
  return <Chat id={id} />;
}
