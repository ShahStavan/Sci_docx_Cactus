"use client";

import { Button } from "@/components/ui/button";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message;
}

export function ChatMessageDeletion({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const onDelete = () => {
    console.log(message.key);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0",
        className
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <IconDelete />
        <span className="sr-only">Delete message</span>
      </Button>
    </div>
  );
}

function IconDelete({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.3846 8.72C19.7976 8.754 20.1056 9.115 20.0726 9.528C20.0666 9.596 19.5246 16.307 19.2126 19.122C19.0186 20.869 17.8646 21.932 16.1226 21.964C14.7896 21.987 13.5036 22 12.2466 22C10.8916 22 9.5706 21.985 8.2636 21.958C6.5916 21.925 5.4346 20.841 5.2456 19.129C4.9306 16.289 4.3916 9.595 4.3866 9.528C4.3526 9.115 4.6606 8.753 5.0736 8.72C5.4806 8.709 5.8486 8.995 5.8816 9.407C5.88479 9.4504 6.10514 12.184 6.34526 14.8887L6.39349 15.4285C6.51443 16.7728 6.63703 18.0646 6.7366 18.964C6.8436 19.937 7.3686 20.439 8.2946 20.458C10.7946 20.511 13.3456 20.514 16.0956 20.464C17.0796 20.445 17.6116 19.953 17.7216 18.957C18.0316 16.163 18.5716 9.475 18.5776 9.407C18.6106 8.995 18.9756 8.707 19.3846 8.72ZM14.3454 2.0003C15.2634 2.0003 16.0704 2.6193 16.3074 3.5063L16.5614 4.7673C16.6435 5.18067 17.0062 5.48256 17.4263 5.48919L20.708 5.4893C21.122 5.4893 21.458 5.8253 21.458 6.2393C21.458 6.6533 21.122 6.9893 20.708 6.9893L17.4556 6.98915C17.4505 6.98925 17.4455 6.9893 17.4404 6.9893L17.416 6.9883L7.04162 6.98918C7.03355 6.98926 7.02548 6.9893 7.0174 6.9893L7.002 6.9883L3.75 6.9893C3.336 6.9893 3 6.6533 3 6.2393C3 5.8253 3.336 5.4893 3.75 5.4893L7.031 5.4883L7.13202 5.4819C7.50831 5.43308 7.82104 5.1473 7.8974 4.7673L8.1404 3.5513C8.3874 2.6193 9.1944 2.0003 10.1124 2.0003H14.3454ZM14.3454 3.5003H10.1124C9.8724 3.5003 9.6614 3.6613 9.6004 3.8923L9.3674 5.0623C9.33779 5.2105 9.29467 5.35331 9.23948 5.48957H15.2186C15.1634 5.35331 15.1201 5.2105 15.0904 5.0623L14.8474 3.8463C14.7964 3.6613 14.5854 3.5003 14.3454 3.5003Z"
        fill="black"
      />
    </svg>
  );
}
