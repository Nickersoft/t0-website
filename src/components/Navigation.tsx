import { useIsScrolling } from "@/hooks/useIsScrolling";
import { Button, buttonVariants } from "./ui/Button";
import { Stack } from "./ui/Stack";

import Logo from "~icons/assets/t0";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/about",
    label: "About Us",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export function Navigation() {
  const height = 80;
  const isScrolling = useIsScrolling();

  return (
    <>
      <nav
        className={cn(
          "fixed z-50 w-full bg-white",
          isScrolling && "border-border/30 border-b shadow-md",
        )}
      >
        <Stack
          orientation="row"
          justify="between"
          align="center"
          style={{ height }}
          className="container py-8"
        >
          <a href="/">
            <Logo className="h-24 w-32" />
          </a>

          <Stack orientation="row" align="center" gap="md">
            <ul className="flex flex-row gap-2 text-sm font-medium">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "text-muted-foreground hover:text-primary",
                    )}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <Button>Access network</Button>
          </Stack>
        </Stack>
      </nav>

      {/* Placeholder */}
      <div style={{ height }}></div>
    </>
  );
}
