import { ComponentProps, forwardRef, useId, useRef } from "react";
import { Rect, Transformer } from "react-konva";
import konva from "konva";
import { ShapeConfig } from "konva/lib/Shape";
import { useImageEditor } from "../image-editor/ImageEditor";
import Konva from "konva";

type SelectionAreaProps = ShapeConfig & {
  transformerProps?: ComponentProps<typeof Transformer>;
  onClick?: (id: string, rect: Konva.Rect | null) => void;
  isSelected?: boolean;
};

export const SelectionArea = forwardRef<Konva.Rect, SelectionAreaProps>(
  ({ transformerProps, onClick, ...props }, ref) => {
    const { selected } = useImageEditor();
    const id = useId();
    const isSelected = id === selected?.id || props.isSelected;
    const trRef = useRef<konva.Transformer | null>(null);

    const handleOnClick = () => {
      if (typeof ref === "function") return;
      if (!ref?.current) return;
      trRef?.current?.nodes([ref.current]);
      trRef?.current?.getLayer()?.batchDraw();
      onClick?.(id, ref.current);
    };

    return (
      <>
        <Rect
          ref={ref}
          width={200}
          height={200}
          {...props}
          onClick={handleOnClick}
          draggable
          onDragEnd={(_evt) => {}}
          onDragMove={(_evt) => {}}
        />
        {isSelected && (
          <Transformer
            rotateEnabled={false}
            ref={trRef as any}
            flipEnabled={false}
            {...transformerProps}
            boundBoxFunc={(oldBox, newBox) => {
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
      </>
    );
  }
);
