import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Typography, type TypographyProps } from "./Typography";

const sectionHeaderVariants = cva(
  "mb-6 flex flex-col max-w-5xl space-y-3 py-6 ",
  {
    variants: {
      align: {
        center: "text-center mx-auto items-center",
        left: "text-left items-start",
      },
    },
    defaultVariants: {
      align: "center",
    },
  },
);

export function SectionHeader({
  className,
  children,
  align,
  ...props
}: React.ComponentProps<"header"> &
  VariantProps<typeof sectionHeaderVariants>) {
  return (
    <header
      data-slot="header"
      className={cn(sectionHeaderVariants({ align }), className)}
      {...props}
    >
      {children}
    </header>
  );
}

const sectionVariants = cva("px-8 py-24", {
  variants: {
    container: {
      true: "container",
      false: "",
    },
    variant: {
      default: "",
      accented:
        "bg-accent py-32 [clip-path:polygon(0_5%,100%_0,100%_95%,0%_100%)]",
    },
  },
  defaultVariants: {
    variant: "default",
    container: false,
  },
});

export function Section({
  variant,
  container,
  children,
  className,
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof sectionVariants>) {
  return (
    <section
      {...props}
      className={cn(sectionVariants({ container, variant }), className)}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <Typography
      variant="display"
      size="md"
      className={cn("[text-align:inherit] text-balance", className)}
      {...props}
    >
      {children}
    </Typography>
  );
}

export function SectionDescription({
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Typography
      color="secondary"
      className={cn("max-w-4xl [text-align:inherit]", className)}
      variant="body"
      size="lg"
      {...props}
    >
      {children}
    </Typography>
  );
}
