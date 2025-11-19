import React from "react";

import { cn, cssVars } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { percent, px } from "@/lib/units";

export interface ProgressiveBlurProps {
  className?: string;
  height?: string;
  position?: "top" | "bottom" | "both";
  blurLevels?: number[];
  children?: React.ReactNode;
}

const progressBlurVariants = cva(
  "pointer-events-none h-(--height) absolute inset-x-0 z-10",
  {
    variants: {
      position: {
        top: "top-0",
        bottom: "bottom-0",
        both: "inset-y-0 h-full",
      },
    },
  },
);

export function ProgressiveBlur({
  className,
  height = "30%",
  position = "bottom",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
}: ProgressiveBlurProps) {
  // Create array with length equal to blurLevels.length - 2 (for before/after pseudo elements)
  const divElements = Array(blurLevels.length - 2).fill(null);
  const overlap = 100 / blurLevels.length;

  return (
    <div
      className={cn(progressBlurVariants({ position }), className)}
      style={cssVars({ height })}
    >
      {/* First blur layer (pseudo element) */}
      <div
        className="absolute inset-0 z-1 mask-(--mask) backdrop-blur-(--blur)"
        style={cssVars({
          zIndex: 1,
          blur: px(blurLevels[0]),
          mask:
            position === "both"
              ? `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)`
              : `linear-gradient(to ${position}, rgba(0,0,0,0) 0%, rgba(0,0,0,1) ${percent(overlap)}, rgba(0,0,0,1) ${50 - 2 * overlap}, rgba(0,0,0,0) ${percent(50 - overlap)})`,
        })}
      />

      {/* Middle blur layers */}
      {divElements.map((_, index) => {
        const blurIndex = index + 1;
        const startPercent = blurIndex * overlap;
        const midPercent = (blurIndex + 1) * overlap;
        const endPercent = (blurIndex + 2) * overlap;

        return (
          <div
            key={`blur-${index}`}
            className="absolute inset-0 z-(--z) mask-(--mask) backdrop-blur-(--blur)"
            style={cssVars({
              z: index + 2,
              blur: px(blurLevels[blurIndex]),
              mask:
                position === "both"
                  ? `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)`
                  : `linear-gradient(to ${position}, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,1) ${midPercent}%, rgba(0,0,0,1) ${endPercent}%, rgba(0,0,0,0) ${endPercent + 12.5}%)`,
            })}
          />
        );
      })}

      {/* Last blur layer (pseudo element) */}
      <div
        className="absolute inset-0 z-(--z) mask-(--mask) backdrop-blur-(--blur)"
        style={cssVars({
          z: blurLevels.length,
          blur: px(blurLevels[blurLevels.length - 1]),
          mask:
            position === "both"
              ? `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)`
              : `linear-gradient(to bottom, rgba(0,0,0,0) ${percent(100 - overlap)}, rgba(0,0,0,1) 100%)`,
        })}
      />
    </div>
  );
}
