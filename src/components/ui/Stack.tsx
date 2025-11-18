import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { omit } from "es-toolkit";

const stackVariants = cva("flex", {
  variants: {
    container: {
      true: "container",
      false: "",
    },
    responsive: {
      true: "max-md:flex-col",
      false: "",
    },
    orientation: {
      column: "flex-col",
      row: "flex-row",
    },
    reverse: {
      true: "",
      false: "",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      normal: "justify-normal",
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
      stretch: "justify-stretch",
    },
    gap: {
      none: "",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-8",
    },
    wrap: {
      true: "flex-wrap",
      false: "",
    },
  },
  compoundVariants: [
    {
      orientation: "column",
      reverse: true,
      className: "flex-col-reverse",
    },
    {
      orientation: "row",
      reverse: true,
      className: "flex-row-reverse",
    },
  ],
  defaultVariants: {
    container: false,
    wrap: false,
    orientation: "column",
    align: "start",
    justify: "start",
    gap: "md",
  },
});

type StackVariants =
  | VariantProps<typeof stackVariants>
  | (Omit<VariantProps<typeof stackVariants>, "justify" | "align"> & {
      centered: true;
    });

type StackProps = React.HTMLAttributes<HTMLElement> &
  StackVariants & {
    asChild?: boolean;
  };

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      orientation,
      asChild,
      className,
      gap,
      wrap,
      container,
      reverse,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : "div";
    const align = "centered" in props ? "center" : props.align;
    const justify = "centered" in props ? "center" : props.justify;

    return (
      <Component
        {...omit(props, ["align", "justify", "centered"])}
        ref={ref}
        className={cn(
          stackVariants({
            wrap,
            reverse,
            container,
            orientation,
            align,
            justify,
            gap,
          }),
          className,
        )}
      >
        {children}
      </Component>
    );
  },
);

Stack.displayName = "Stack";

export { Stack, stackVariants };
