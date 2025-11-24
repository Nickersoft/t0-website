import type { ComponentProps } from "react";

import { RIVE_WASM_URL } from "@/consts";
import {
  Alignment,
  Fit,
  Layout,
  RuntimeLoader,
  type UseRiveParameters,
  useRive,
} from "@rive-app/react-webgl2";
import { animate } from "motion";
import { inView } from "motion/react";

RuntimeLoader.setWasmUrl(RIVE_WASM_URL);

const fitMap = {
  cover: Fit.Cover,
  contain: Fit.Contain,
  fill: Fit.Fill,
  none: Fit.None,
} satisfies Record<string, Fit>;

const alignmentMap = {
  center: Alignment.Center,
  top: Alignment.TopCenter,
  topLeft: Alignment.TopLeft,
  topRight: Alignment.TopRight,
  bottom: Alignment.BottomCenter,
  bottomLeft: Alignment.BottomLeft,
  bottomRight: Alignment.BottomRight,
  left: Alignment.CenterLeft,
  right: Alignment.CenterRight,
};

export type RiveProps = ComponentProps<"canvas"> & {
  src: string;
  artboard?: string;
  playMode?: "in-view" | "autoplay";
  params?: Partial<
    Omit<NonNullable<UseRiveParameters>, "artboard" | "layout" | "src">
  > | null;
  fit?: keyof typeof fitMap;
  alignment?: keyof typeof alignmentMap;
};

export function Rive({
  fit,
  playMode = "autoplay",
  alignment,
  params,
  artboard,
  src,
  ...props
}: RiveProps) {
  const { onLoad = () => {}, ...restParams } = params ?? {};

  const { RiveComponent, container } = useRive(
    {
      ...restParams,
      src,
      artboard,
      stateMachines: params?.stateMachines ?? "State Machine 1",
      autoplay: playMode === "autoplay",
      autoBind: true,
      layout: new Layout({
        ...(fit && { fit: fitMap[fit] }),
        ...(alignment && { alignment: alignmentMap[alignment] }),
      }),
      onLoad: (e) => {
        animate(container as HTMLElement, { opacity: [0, 1] });
        onLoad(e);
      },
      onRiveReady(rive) {
        function bindViewModel() {
          const vm = rive.defaultViewModel();
          const vmi = vm?.defaultInstance();

          if (!vmi) return;

          rive.bindViewModelInstance(vmi);
        }

        if (playMode === "in-view") {
          inView(
            container as HTMLElement,
            () => {
              rive.play();
              return () => {
                rive.reset();
                bindViewModel();
              };
            },
            { amount: 0.5 },
          );
        }
      },
    },
    { shouldUseIntersectionObserver: true },
  );

  return <RiveComponent {...props} />;
}
