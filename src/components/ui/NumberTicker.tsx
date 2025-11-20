import { type ComponentPropsWithoutRef, useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  formatOptions?: Intl.NumberFormatOptions;
  direction?: "up" | "down";
  damping?: number;
  stiffness?: number;
  delay?: number;
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  damping = 60,
  stiffness = 100,
  delay = 0,
  className,
  formatOptions,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : startValue);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction, startValue]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat(
            "en-GB",
            formatOptions,
          ).format(Number(latest));
        }
      }),
    [springValue, formatOptions],
  );

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums", className)}
      {...props}
    >
      {startValue}
    </span>
  );
}
