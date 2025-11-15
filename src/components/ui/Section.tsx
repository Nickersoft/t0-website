import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Typography, type TypographyProps } from "./Typography";

const sectionHeaderVariants = cva(
  "mb-6 flex flex-col max-w-5xl space-y-3 py-6 ",
  {
    variants: {
      align: {
        center: "text-center items-center",
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

const sectionVariants = cva("py-24", {
  variants: {
    variant: {
      default: "",
      accented:
        "bg-accent py-32 [clip-path:polygon(0_5%,100%_0,100%_95%,0%_100%)]",
    },
    layout: {
      vertical:
        "*:data-[slot=content]:flex *:data-[slot=content]:items-center *:data-[slot=content]:flex-col",
      horizontal:
        "*:data-[slot=content]:items-center *:data-[slot=content]:grid *:data-[slot=content]:gap-6 *:data-[slot=content]:grid-cols-2 *:data-[slot=content]:max-md:grid-cols-1",
    },
  },
  defaultVariants: {
    variant: "default",
    layout: "vertical",
  },
});

export function Section({
  variant,
  layout,
  children,
  className,
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof sectionVariants>) {
  return (
    <section
      {...props}
      className={cn(sectionVariants({ variant, layout }), className)}
    >
      <div className="container" data-slot="content">
        {children}
      </div>
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
      className={cn("text-balance", className)}
      {...props}
    >
      {children}
    </Typography>
  );
}

export function SectionSubtitle({
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Typography
      color="secondary"
      className={cn("max-w-3xl", className)}
      variant="body"
      size="lg"
      {...props}
    >
      {children}
    </Typography>
  );
}
