import * as React from "react";

import { Button } from "@/components/ui/Button";
import { cssVars } from "@/lib/utils";
import { px } from "@/lib/units";
import { List, X } from "@/icons";

interface MobileNavigationProps extends React.ComponentProps<"div"> {
  navigationHeight?: number;
}
export function MobileNavigation({
  children,
  navigationHeight = 0,
}: MobileNavigationProps) {
  const id = React.useId();

  return (
    <>
      <input type="checkbox" id={id} className="peer sr-only" />

      <div
        style={cssVars({ height: px(navigationHeight) })}
        className="group max-md:fixed max-md:top-[calc(var(--height)-1px)] max-md:left-0 max-md:z-999 max-md:grid max-md:w-screen max-md:grid-rows-[0fr] max-md:bg-white max-md:transition-[grid-template-rows] max-md:delay-100 max-md:duration-300 max-md:ease-out max-md:peer-checked:grid-rows-[1fr] max-md:peer-checked:delay-0"
      >
        <div className="max-md:group-peer-checked:fade-in max-md:group-peer-checked:slide-in-from-top-6 max-md:slide-out-to-top-6 max-md:fade-out max-md:animate-out max-md:group-peer-checked:animate-in max-md:fill-mode-both max-md:min-h-0 max-md:transform-gpu max-md:overflow-hidden max-md:duration-300 max-md:group-peer-checked:delay-100">
          <div className="max-md:container max-md:p-4">{children}</div>
        </div>
      </div>

      <Button
        asChild
        variant="ghost"
        className="text-muted-foreground group size-10 md:hidden [&>svg]:size-6"
        size="icon"
      >
        <label
          htmlFor={id}
          className="[&>svg]:ease-out] relative [&>svg]:transition-all [&>svg]:duration-300"
        >
          <List className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-peer-checked:-rotate-45 group-peer-checked:opacity-0" />
          <X className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-peer-not-checked:-rotate-45 group-peer-not-checked:opacity-0" />
        </label>
      </Button>
    </>
  );
}
