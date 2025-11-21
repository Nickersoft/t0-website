import { List } from "@/icons";

import {
  Sheet,
  SheetContent,
  type SheetContentProps,
  SheetTrigger,
} from "@/components/ui/Sheet";

interface NavigationMenuProps {
  children: React.ReactNode;
  side?: SheetContentProps["side"];
}

export function NavigationBar({ side, children }: NavigationMenuProps) {
  return (
    <>
      <div className="hidden md:contents">{children}</div>
      <div className="contents md:hidden">
        <Sheet>
          <SheetTrigger className="flex cursor-pointer items-center justify-center">
            <List className="size-6" />
          </SheetTrigger>
          <SheetContent className="size-full" side={side}>
            {children}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
