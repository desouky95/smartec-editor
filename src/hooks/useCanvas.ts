import {
  MutableRefObject,
  useEffect,
  useRef,
  CSSProperties,
  useCallback,
  useState,
} from "react";

type UseCanvasArgs = {
  parent?: MutableRefObject<HTMLElement | null>;
} & Pick<CSSProperties, "width" | "height" | "background">;
export function useCanvas({ parent, width, height, ...styles }: UseCanvasArgs) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const draw = useCallback(() => {
    const parentSize = parent?.current?.getBoundingClientRect();
    const size = {
      width: parentSize?.width ?? width,
      height: parentSize?.height ?? height,
    };
    if (!ref.current) return;
    setCtx(ref.current.getContext("2d"));
    ref.current.width = Number(size.width);
    ref.current.height = Number(size.height);
    ref.current.style.background = styles.background?.toString() ?? "white";
  }, []);
  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => {
      window.removeEventListener("resize", draw);
    };
  }, []);

  return [ref, ctx] as const;
}
