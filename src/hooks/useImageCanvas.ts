import { useCallback, useEffect, useState } from "react";
import { useCanvas } from "./useCanvas";

type UseImageCanvasArgs = {
  src: string;
} & Parameters<typeof useCanvas>[0];

export function useImageCanvas({ src, ...useCanvasProps }: UseImageCanvasArgs) {
  const [ref, ctx] = useCanvas(useCanvasProps);

  const [img] = useState(() => {
    const img = new window.Image();
    img.src = src;
    return img;
  });
  const [stagePosition, setStagePosition] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const draw = useCallback(() => {
    if (!ref.current || !ctx || !img.src) return;

    const canvas = ref.current;

    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );

    setStagePosition({
      height: img.height * ratio,
      width: img.width * ratio,
      x: centerShift_x,
      y: centerShift_y,
    });
  }, [ctx, img.src, ref.current]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => {
      window.removeEventListener("resize", draw);
    };
  }, [img.src, ctx]);

  return [ref, ctx, img, stagePosition] as const;
}
