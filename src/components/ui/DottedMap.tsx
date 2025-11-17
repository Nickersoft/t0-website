import * as React from "react";
import { createMap } from "svg-dotted-map";
import { motion } from "motion/react";
import { Path } from "svg-pathgen";

export interface Connection {
  start: { lat: number; lng: number; label?: string };
  end: { lat: number; lng: number; label?: string };
}

export interface DottedMapProps {
  width?: number;
  height?: number;
  mapSamples?: number;
  connections?: Connection[];
  dotColor?: string;
  lineColor?: string;
  dotRadius?: number;
  className?: string;
}

export function DottedMap({
  width = 152,
  height = 75,
  mapSamples = 5000,
  connections = [],
  dotColor = "currentColor",
  lineColor = "#0ea5e9",
  dotRadius = 0.2,
  className,
}: DottedMapProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Generate map data once
  const mapData = React.useMemo(() => {
    const { points, addMarkers } = createMap({
      width,
      height,
      mapSamples,
    });

    const markers = addMarkers(
      connections.flatMap(({ end, start }) => [start, end]),
    );

    return { points, markers };
  }, [width, height, mapSamples, connections]);

  // Draw canvas dots with proper scaling
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvas = () => {
      // Get actual rendered size
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Set canvas size to match container with device pixel ratio
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scale context to match DPR
      ctx.scale(dpr, dpr);

      // Calculate scale to match SVG's default preserveAspectRatio behavior
      const viewBoxAspect = width / height;
      const containerAspect = rect.width / rect.height;

      let scaleX,
        scaleY,
        offsetX = 0,
        offsetY = 0;

      if (containerAspect > viewBoxAspect) {
        // Container is wider - fit to height
        scaleY = rect.height / height;
        scaleX = scaleY;
        offsetX = (rect.width - width * scaleX) / 2;
      } else {
        // Container is taller - fit to width
        scaleX = rect.width / width;
        scaleY = scaleX;
        offsetY = (rect.height - height * scaleY) / 2;
      }

      // Get computed color from CSS
      const computedColor = getComputedStyle(canvas).color;
      ctx.fillStyle = computedColor || dotColor;

      // Draw all dots with proper scaling and offset
      mapData.points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(
          point.x * scaleX + offsetX,
          point.y * scaleY + offsetY,
          dotRadius * scaleX,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });
    };

    updateCanvas();

    // Redraw on resize
    const resizeObserver = new ResizeObserver(updateCanvas);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [width, height, mapData.points, dotColor, dotRadius]);

  const createCurvedPath = React.useCallback(
    (start: { x: number; y: number }, end: { x: number; y: number }) => {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2 - height * 0.2;

      return new Path()
        .moveTo(start.x, start.y)
        .curveTo(end.x, end.y, {
          type: "cubic",
          smooth: true,
          control: [midX, midY],
        })
        .toString();
    },
    [height],
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      {/* Canvas for static dots */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          color: "inherit",
          overflow: "visible",
        }}
      />

      {/* SVG overlay for animated connections only */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {connections.map((_, i) => {
          const idx = i * 2;
          const startMarker = mapData.markers[idx];
          const endMarker = mapData.markers[idx + 1];

          if (!startMarker || !endMarker) {
            return null;
          }

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startMarker, endMarker)}
                fill="none"
                stroke={lineColor}
                strokeWidth={dotRadius / 2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 * i, ease: "easeOut" }}
              />
            </g>
          );
        })}

        {mapData.markers.map((marker, index) => (
          <g key={`marker-group-${index}`}>
            <circle
              cx={marker.x}
              cy={marker.y}
              r={dotRadius}
              fill={lineColor}
            />
            <circle
              cx={marker.x}
              cy={marker.y}
              r={dotRadius}
              fill={lineColor}
              opacity="0.5"
            >
              <animate
                attributeName="r"
                from={dotRadius}
                to={dotRadius * 4}
                dur="1.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.5"
                to="0"
                dur="1.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}
