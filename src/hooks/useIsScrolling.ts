import * as React from "react";

/**
 * Determines if the user is actively scrolling within the provided element.
 *
 * @param ref - The element to monitor for scrolling.
 *
 * @returns True if the user is actively scrolling, false otherwise.
 *
 * @example
 * ```tsx
 * import { useRef } from "react";
 *
 * import { useIsScrolling } from "@/hooks/use-is-scrolling";
 *
 * const Component = () => {
 *  const ref = useRef<HTMLDivElement>(null);
 *  const scrolling = useIsScrolling(ref);
 *
 *  return (
 *    <div ref={ref}>
 *      {scrolling ? "Scrolling" : "Not scrolling"}
 *    </div>
 *  );
 * };
 * ```
 */
export function useIsScrolling(target?: React.RefObject<HTMLElement>): boolean {
  const [scrolling, setScrolling] = React.useState<boolean>(false);

  React.useEffect(() => {
    const el = target?.current ?? window;

    function handleScroll() {
      setScrolling(
        (target?.current.scrollTop ??
          window.document.documentElement.scrollTop) > 0,
      );
    }

    handleScroll();

    el.addEventListener("scroll", handleScroll, false);

    return () => {
      el.removeEventListener("scroll", handleScroll, false);
    };
  }, [target]);

  return scrolling;
}

export default useIsScrolling;
