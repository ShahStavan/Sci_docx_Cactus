'use client'

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import InputBox from "../ui/inputbar"
import { cn } from "@/lib/utils"
import { ChatScrollAnchor } from "../react-scroll-anchor"
import { EmptyScreen } from "./empty-screen"
import { ChatList } from "./chatlist"
import { auth, db } from "@/firebase/main"
import { getData } from "@/lib/hooks/get-realtime-data"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"

export interface ChatProps extends React.ComponentProps<'div'> {
    // initialMessages?: Message[]
    id?: string
  }
  
  export function Chat({ id /*, initialMessages */, className }: ChatProps) {
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<any>([]);
    
    useEffect(() => {
      const userId = "C9N4g6ffcDgyrwZH07KDZlmgEZV2";

      console.log(userId);
    
      let q = query(collection(db, "Users", `${userId}`, "Messages"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const getPostsFromFirebase: any = [];
        querySnapshot.forEach((doc: any) => {
          getPostsFromFirebase.push({
            ...doc.data(),
            key: doc.id,
          });
        });
        if (!isLoading) {
          setMessages(getPostsFromFirebase);
        }
        setIsLoading(false);
      });
    
      return () => unsubscribe();
    }, [isLoading]);
    
    console.log(messages);

    return (
      <main className="flex flex-1">
      <div className={cn('pb-[200px] pt-4 flex-1 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>

      <InputBox input={input} setInput={setInput} onSubmit={(value: string) => {
        // Implement your message submission logic here
      }} isLoading={isLoading} />
    </main>
    )
  }
  