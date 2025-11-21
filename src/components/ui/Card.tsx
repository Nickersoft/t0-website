import * as React from "react";

import { cn } from "@/lib/utils";
import { typographyVariants, type TypographyProps } from "./Typography";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "group/card py-(--s) gap-(--s) text-card-foreground rounded-2xl",
  {
    variants: {
      container: {
        true: "container",
        false: "",
      },
      variant: {
        default: "bg-card text-card-foreground border shadow-md",
        outline: "border",
        primary: "bg-linear-to-b from-green-800 to-green-700",
      },
      size: {
        sm: "[--s:--spacing(4)]",
        default: "[--s:--spacing(6)]",
        lg: "[--s:--spacing(8)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Card({
  className,
  variant,
  container,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-variant={variant}
      className={cn(cardVariants({ container, size, variant }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-0.5 px-(--s) has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({
  className,
  color = "default",
  variant = "title",
  size = "md",
  ...props
}: TypographyProps & React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        typographyVariants({ variant, color, size }),
        "group-data-[variant=primary]/card:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  color = "muted",
  variant = "body",
  size = "md",
  ...props
}: TypographyProps & React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        typographyVariants({ color, variant, size }),
        "group-data-[variant=primary]/card:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--s)", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-(--s) [.border-t]:pt-(--s)",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
