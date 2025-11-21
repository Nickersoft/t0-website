import { useIsScrolling } from "@/hooks/useIsScrolling";
import {
  Button,
  buttonVariants,
  type ButtonProps,
} from "@/components//ui/Button";
import { Stack } from "@/components//ui/Stack";
import { MobileNavigation } from "@/components/ui/MobileNavigation";

import { cn } from "@/lib/utils";

import Logo from "~icons/assets/t0";
import type React from "react";
import { Link, type LinkProps } from "./ui/Link";

const links = [
  {
    href: "/about",
    label: "About Us",
  },
];

function NavigationItem({ children, className, href, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={cn("max-md:w-full max-md:justify-start", className)}
      href={href}
    >
      {children}
    </Link>
  );
}

export function Navigation() {
  const height = 72;
  const isScrolling = useIsScrolling();

  return (
    <>
      <nav
        style={{ height }}
        className={cn(
          "@container-[size] fixed top-0 z-50 w-full bg-white",
          isScrolling && "border-border/30 border-b shadow-xl shadow-black/3",
        )}
      >
        <Stack
          orientation="row"
          justify="between"
          align="center"
          className="container h-full py-8"
        >
          <a href="/">
            <Logo className="h-28 w-36" />
          </a>

          <Stack orientation="row" align="center" gap="md">
            <Button className="max-[25rem]:hidden md:hidden">
              Access network
            </Button>

            <MobileNavigation navigationHeight={height}>
              <ul
                className={cn(
                  "flex flex-row gap-3 text-sm font-medium",
                  "max-md:container max-md:w-full max-md:flex-col max-md:items-stretch max-md:p-4",
                )}
              >
                <NavigationItem variant="ghost" href="/about">
                  About Us
                </NavigationItem>
                <NavigationItem
                  href="/access"
                  variant="default"
                  className="max-md:mt-8 max-md:w-full min-[25rem]:hidden md:block"
                >
                  Access network
                </NavigationItem>
              </ul>
            </MobileNavigation>
          </Stack>
        </Stack>
      </nav>

      {/* Placeholder */}
      <div style={{ height }}></div>
    </>
  );
}
