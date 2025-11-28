import { useIsScrolling } from "@/hooks/useIsScrolling";

import { Button } from "@/components/ui/Button";
import { Stack } from "@/components/ui/Stack";
import { Link, type LinkProps } from "@/components/ui/Link";
import { MobileNavigation } from "@/components/ui/MobileNavigation";

import { cn } from "@/lib/utils";

import Logo from "~icons/assets/t0";

function NavigationItem({
  children,
  className,
  href,
  ...props
}: LinkProps & { children: string }) {
  return (
    <Link
      {...props}
      title={children}
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
          <a href="/" title="Logo">
            <Logo className="h-28 w-36" />
          </a>

          <Stack orientation="row" align="center" gap="md">
            <Button className="max-[25rem]:hidden md:hidden">
              Access The Network
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
                  className="max-md:mt-2 max-md:w-full min-[25rem]:hidden md:block"
                >
                  Access The Network
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
