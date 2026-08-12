import type { ReactNode } from "react";
import { TabBar } from "@/komponen/ui";

export default function LayoutApp({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-ground">
      <div className="pb-[68px]">{children}</div>
      <div className="fixed bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 bg-ground">
        <TabBar />
      </div>
    </div>
  );
}
