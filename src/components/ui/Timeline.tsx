import * as React from "react";
import { Stack } from "./Stack";
import { Typography } from "./Typography";

import { Path } from "svg-pathgen";
import { animate, stagger, useInView, type Segment } from "motion/react";
import { zip } from "es-toolkit";
import { cn } from "@/lib/utils";

const DOT_SIZE = 14;
const RING_SIZE = 24;
const DOT_CENTER = RING_SIZE / 2;
const STROKE_WIDTH = 2;

function TimelineItem({ children }: React.ComponentProps<"div">) {
  return (
    <Stack orientation="row" className="step h-22 py-4 opacity-50">
      <div className="relative flex size-3">
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          className="dot absolute top-1/2 left-1/2 max-w-none! -translate-x-1/2 -translate-y-1/2"
        >
          {[DOT_SIZE, RING_SIZE].map((size, i) => (
            <circle
              key={size}
              cx={DOT_CENTER}
              cy={DOT_CENTER}
              r={size / 2}
              opacity={i > 0 ? 0 : 1}
              className={cn(
                "fill-secondary-foreground group-data-[variant=primary]/tl:fill-primary",
                i === 0 && "mask-t-to-black/90",
                i > 0 && "ring",
              )}
            />
          ))}
        </svg>
      </div>

      <Stack orientation="column" gap="xs">
        {children}
      </Stack>
    </Stack>
  );
}

function TimelineItemLabel({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "color">) {
  return (
    <Typography
      variant="label"
      color="secondary"
      size="md"
      {...props}
      className={cn("group-data-[variant=primary]:text-primary/80")}
    >
      {children}
    </Typography>
  );
}

function TimelineItemTitle({
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "color">) {
  return (
    <Typography variant="body" size="lg" {...props}>
      {children}
    </Typography>
  );
}

function TimelineRunner({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const inView = useInView(containerRef);

  const [segmentRefs, setSegmentRefs] = React.useState<
    React.RefObject<SVGPathElement | null>[]
  >([]);

  const [svgSize, setSvgSize] = React.useState({ width: 0, height: 0 });

  const [pathSegments, setPathSegments] = React.useState<string[]>([]);

  const dots = React.useMemo<Element[]>(
    () => Array.from(containerRef.current?.querySelectorAll(".dot") ?? []),
    [containerRef.current],
  );

  const steps = React.useMemo<Element[]>(
    () => Array.from(containerRef.current?.querySelectorAll(".step") ?? []),
    [containerRef.current],
  );

  // Optimization #4: Only update segmentRefs when length actually changes
  React.useEffect(() => {
    if (segmentRefs.length !== pathSegments.length) {
      setSegmentRefs(() =>
        Array(pathSegments.length)
          .fill(null)
          .map((_, i) => segmentRefs[i] || React.createRef()),
      );
    }
  }, [pathSegments.length, segmentRefs.length]);

  const calculatePaths = React.useCallback(() => {
    if (!containerRef.current || dots.length === 0) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const paths = [];
    const rects = dots.map((dot) => dot.getBoundingClientRect());

    if (rects.length === 0) return;

    const x = rects[0].left - containerRect.left + rects[0].width / 2;

    const y = rects.map(
      (rect) => rect.top - containerRect.top + (rect.height + DOT_SIZE) / 2,
    );

    for (let i = 0; i < dots.length; i++) {
      const rect = rects[i];
      const y1 = y[i];
      const y2 = y[i + 1] - DOT_SIZE;

      if (!rect || !y2) continue;

      const path = new Path().moveTo(x, y1).verticalLineTo(y2).end();

      paths.push(path);
    }

    setSvgSize({ width: containerRect.width, height: containerRect.height });
    setPathSegments(paths);
  }, [containerRef, dots]);

  React.useEffect(() => {
    calculatePaths();
  }, [calculatePaths]);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(() => calculatePaths());

    if (containerRef?.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculatePaths, containerRef]);

  React.useEffect(() => {
    if (!containerRef.current || !inView) return;

    const components = zip(steps, segmentRefs);

    const animations = components.flatMap(([step, segment]) => {
      const animations: Segment[] = [];

      if (step) {
        const rings = Array.from(step.querySelectorAll(".ring"));

        animations.push([step, { opacity: [0.5, 1] }]);

        animations.push([
          rings,
          { scale: [0, 1], opacity: [0, 0.4, 0] },
          { delay: stagger(0.2), duration: 1.5, at: "-0.7" },
        ]);
      }

      if (segment?.current) {
        animations.push([
          segment.current,
          { pathLength: [0, 1] },
          { duration: 1, at: "-0.5" },
        ]);
      }

      return animations;
    });

    if (animations.length > 0) {
      animate(animations);
    }
  }, [containerRef, steps, inView, segmentRefs]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="absolute inset-0"
      viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
      width={svgSize.width}
      height={svgSize.height}
    >
      {pathSegments.map((d, i) => (
        <React.Fragment key={i}>
          <path strokeWidth={STROKE_WIDTH} className="stroke-border" d={d} />
          <path
            ref={segmentRefs[i]}
            strokeWidth={STROKE_WIDTH}
            pathLength={0}
            className="stroke-muted-foreground group-data-[variant=primary]/tl:stroke-primary"
            d={d}
          />
        </React.Fragment>
      ))}
    </svg>
  );
}

function Timeline({
  children,
  className,
  variant = "default",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  variant?: "default" | "primary";
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  return (
    <Stack
      data-variant={variant}
      className={cn("group/tl relative", className)}
      ref={ref}
      {...props}
    >
      <TimelineRunner containerRef={ref} />
      {children}
    </Stack>
  );
}

export { TimelineItem, Timeline, TimelineItemLabel, TimelineItemTitle };
