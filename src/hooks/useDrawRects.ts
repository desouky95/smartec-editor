import Konva from "konva";
import { MutableRefObject, createRef, useCallback, useState } from "react";

type UseDrawRectsArgs = {
  // parent ?: MutableRefObject<HTMLCanvasElement | null>
  ctx: CanvasRenderingContext2D | null;
};

export type RectCoords = {
  id: string;
  ref: MutableRefObject<Konva.Rect>;
  width: number;
  height: number;
  x: number;
  y: number;
};
export function useDrawRects({ ctx }: UseDrawRectsArgs) {
  const [rects, setRects] = useState<RectCoords[]>([]);

  const draw = useCallback(
    (rect: Konva.Rect) => {
      if (!ctx) return;

      const rectPosition = rect.getAbsolutePosition();
      const rectSize = rect.getSize();
      const scale = rect.getAbsoluteScale();
      const absoluteSize = {
        width: rectSize.width * scale.x,
        height: rectSize.height * scale.y,
      };
      const id = [
        rectPosition.x,
        rectPosition.y,
        absoluteSize.width,
        absoluteSize.height,
      ].join("");
      const size = { ...rectPosition, ...absoluteSize, id };
      const ref = createRef() as MutableRefObject<Konva.Rect>;

      setRects((prev) => [...prev, { ...size, ref }]);
    },
    [ctx]
  );

  const remove = (rect: Konva.Rect) => {
    const index = rects.findIndex((_) => _.ref.current._id === rect._id);
    if (index < 0) return;
    const _new_rects = rects;
    _new_rects.splice(index, 1);
    setRects(_new_rects);
  };

  const clear = () => setRects([]);

  const apply = () => {
    if (!ctx) return;
    rects.forEach((rect) => {
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    });
  };

  return { rects, draw, remove, clear, apply } as const;
}
