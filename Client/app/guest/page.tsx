import { EmptyScreenGuest } from "@/components/guest/emptywall";
import { cn } from "@/lib/utils";

export default function Guest({ className }: any) {

  return (
    <main className="flex flex-1">
      <div className={cn('pb-[200px] pt-4 flex-1 md:pt-10', className)}>
        <EmptyScreenGuest />
      </div>
    </main>
  )
}
