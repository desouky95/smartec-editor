import {
  MutableRefObject,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import "react-advanced-cropper/dist/style.css";
import { Layer, Stage } from "react-konva";
import konva from "konva";
import { useImageCanvas } from "../../hooks/useImageCanvas";
import { SelectionArea } from "../selection-area/SelectionArea";
import { useDrawRects } from "../../hooks/useDrawRects";
import Konva from "konva";
type ImageEditorProps = {
  src: string;
  file: File;
  onClose?: () => void;
};
export const ImageEditor = ({ src, onClose, file }: ImageEditorProps) => {
  const selectedAreaBox = useRef<konva.Rect | null>(null);
  const parent = useRef<HTMLDivElement | null>(null);
  const [ref, ctx, _img, stagePosition] = useImageCanvas({
    background: "black",
    parent,
    src,
  });

  const [selected, setSelected] = useState<{
    id: string | undefined;
    rect: Konva.Rect | null;
  }>();
  const { rects, draw, remove, clear, apply } = useDrawRects({ ctx });

  const onHideArea = () => {
    if (!selectedAreaBox.current) return;
    draw(selectedAreaBox.current);
  };

  const onViewSelectedArea = () => {
    if (!selected?.rect) return;
    remove(selected.rect);
    setSelected({ id: undefined, rect: null });
  };

  const onViewAll = () => {
    clear();
  };

  const transformRef = useRef<konva.Transformer | null>(null);

  const handleBoxClick = (id: string, rect: Konva.Rect) => {
    setSelected({ id, rect });
  };

  const onDownload = () => {
    if (!ref.current || !ctx) return;
    apply();
    const canvas = ref.current;
    ctx.globalCompositeOperation = "destination-over";

    var tempCanvas = document.createElement("canvas"),
      tCtx = tempCanvas.getContext("2d");
    tempCanvas.width = stagePosition.width;
    tempCanvas.height = stagePosition.height;

    tCtx?.drawImage(canvas, -1 * stagePosition.x, 0);

    const a = document.createElement("a");
    a.setAttribute("download", file.name);
    a.setAttribute("href", tempCanvas.toDataURL());

    a.click();
    onClose?.();
  };

  return (
    <div className="w-screen h-[100vh] absolute top-0 left-0 bg-white">
      <div className="flex h-full">
        <div className="flex-0 min-w-[400px] p-4 grid grid-rows-[auto_1fr] animate-[fade-in-left_500ms_ease-in-out]">
          <button
            className="rounded-md bg-blue-500 text-white p-3 hover:bg-blue-400 active:scale-105 transition-transform mb-10"
            onClick={onClose}
          >
            Close
          </button>

          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <button
                onClick={onHideArea}
                className="rounded-md bg-slate-300 p-3 w-full"
              >
                Hide selected Areas
              </button>
              <button
                onClick={onViewSelectedArea}
                className="rounded-md bg-slate-300 p-3 w-full"
              >
                View selected Areas
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={onViewAll}
                className="rounded-md bg-slate-300 p-3 w-full"
              >
                View All
              </button>
              <button
                onClick={onDownload}
                className="rounded-md bg-blue-500 p-3 w-full text-white"
              >
                Download
              </button>
            </div>
          </div>
        </div>
        <div
          id="editor-parent"
          ref={parent}
          className="flex-1 bg-slate-400 relative  overflow-hidden animate-[fade-in-right_500ms_ease-in-out]"
        >
          <canvas id="image-editor" ref={ref} className="w-full h-screen " />
          <Stage
            className="absolute left-0 top-0 z-10"
            width={parent.current?.clientWidth}
            height={parent.current?.clientHeight}
            style={{
              border: "2px inset red",
            }}
          >
            <Layer>
              <ImageEditorProvider
                transformer={transformRef}
                selected={selected}
              >
                {rects.map((rect) => {
                  return (
                    <SelectionArea
                      key={rect.id}
                      width={rect.width}
                      height={rect.height}
                      x={rect.x}
                      y={rect.y}
                      fill="black"
                      ref={rect.ref}
                      onClick={handleBoxClick}
                      stroke="white"
                      strokeWidth={1}
                    />
                  );
                })}
                <SelectionArea
                  stroke="white"
                  strokeWidth={0.5}
                  ref={selectedAreaBox as any}
                  fill="rgba(0,0,0,0.3)"
                  onClick={handleBoxClick}
                  width={200}
                  height={200}
                />
              </ImageEditorProvider>
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

type ImageEditorConxtextArgs = {
  transformer?: MutableRefObject<Konva.Transformer | null>;
  selected?: { id?: string; rect: Konva.Rect | null };
};

const ImageEditorConxtext = createContext<ImageEditorConxtextArgs | null>(null);

const ImageEditorProvider = ({
  children,
  ...value
}: PropsWithChildren<ImageEditorConxtextArgs>) => {
  return (
    <ImageEditorConxtext.Provider value={value}>
      {children}
    </ImageEditorConxtext.Provider>
  );
};

export const useImageEditor = () => {
  const ctx = useContext(ImageEditorConxtext);
  if (!ctx) throw new Error("ImageEditor not found !!!");
  return ctx;
};
