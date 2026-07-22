"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Fixed landscape output frame.
export const CROP_ASPECT = 4 / 3;
const OUTPUT_WIDTH = 1600;
const MIN_SELECTION = 30; // px in displayed-image space
const HANDLES = ["tl", "tr", "bl", "br"] as const;
type Handle = (typeof HANDLES)[number];
type Rect = { x: number; y: number; w: number; h: number };

export default function ImageCropFrame({
  file,
  onComplete,
  onCancel,
  busy = false,
  queueLabel,
}: {
  file: File;
  onComplete: (blob: Blob) => void;
  onCancel: () => void;
  busy?: boolean;
  queueLabel?: string;
}) {
  const workRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [disp, setDisp] = useState({ w: 0, h: 0 });
  const [sel, setSel] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const drag = useRef<
    | { mode: "move" | Handle; rect: DOMRect; startX: number; startY: number; base: Rect }
    | null
  >(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Measure the displayed (contained) image and reset the selection to cover
  // the whole image — so by default the full photo fills the frame.
  const measure = useCallback(() => {
    const el = workRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w && h) {
      setDisp({ w, h });
      setSel({ x: 0, y: 0, w, h });
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, img]);

  const clampRect = useCallback(
    (r: Rect): Rect => {
      const w = Math.max(MIN_SELECTION, Math.min(r.w, disp.w));
      const h = Math.max(MIN_SELECTION, Math.min(r.h, disp.h));
      const x = Math.max(0, Math.min(r.x, disp.w - w));
      const y = Math.max(0, Math.min(r.y, disp.h - h));
      return { x, y, w, h };
    },
    [disp.w, disp.h],
  );

  function beginDrag(mode: "move" | Handle, event: React.PointerEvent) {
    event.stopPropagation();
    const rect = workRef.current!.getBoundingClientRect();
    drag.current = {
      mode,
      rect,
      startX: event.clientX,
      startY: event.clientY,
      base: sel,
    };
    (event.target as Element).setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const px = event.clientX - d.rect.left;
    const py = event.clientY - d.rect.top;

    if (d.mode === "move") {
      const dx = event.clientX - d.startX;
      const dy = event.clientY - d.startY;
      setSel(clampRect({ ...d.base, x: d.base.x + dx, y: d.base.y + dy }));
      return;
    }

    const left = d.base.x;
    const top = d.base.y;
    const right = d.base.x + d.base.w;
    const bottom = d.base.y + d.base.h;
    let next: Rect = d.base;
    if (d.mode === "tl") next = { x: px, y: py, w: right - px, h: bottom - py };
    if (d.mode === "tr") next = { x: left, y: py, w: px - left, h: bottom - py };
    if (d.mode === "bl") next = { x: px, y: top, w: right - px, h: py - top };
    if (d.mode === "br") next = { x: left, y: top, w: px - left, h: py - top };
    // Normalize any negative dimensions before clamping.
    if (next.w < 0) next = { ...next, x: next.x + next.w, w: -next.w };
    if (next.h < 0) next = { ...next, y: next.y + next.h, h: -next.h };
    setSel(clampRect(next));
  }

  function onPointerUp(event: React.PointerEvent) {
    if (drag.current) {
      try {
        (event.target as Element).releasePointerCapture?.(event.pointerId);
      } catch {
        /* already released */
      }
    }
    drag.current = null;
  }

  function handleConfirm() {
    if (!img || !disp.w) return;
    const scale = img.naturalWidth / disp.w; // displayed px -> source px
    const sx = sel.x * scale;
    const sy = sel.y * scale;
    const sw = sel.w * scale;
    const sh = sel.h * scale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_WIDTH;
    canvas.height = Math.round(OUTPUT_WIDTH / CROP_ASPECT);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Stretch the selected region to fill the fixed landscape frame.
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => blob && onComplete(blob), "image/jpeg", 0.9);
  }

  const handleStyle: React.CSSProperties = {
    position: "absolute",
    width: 18,
    height: 18,
    background: "#C9A961",
    border: "2px solid #0E1114",
    borderRadius: 3,
    touchAction: "none",
  };
  const handlePos: Record<Handle, React.CSSProperties> = {
    tl: { left: -9, top: -9, cursor: "nwse-resize" },
    tr: { right: -9, top: -9, cursor: "nesw-resize" },
    bl: { left: -9, bottom: -9, cursor: "nesw-resize" },
    br: { right: -9, bottom: -9, cursor: "nwse-resize" },
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-ink/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-sm bg-ivory p-5 shadow-2xl">
        <div className="mb-4">
          <p className="font-body text-[11px] uppercase tracking-[0.35em] text-gold">
            Frame Photo{queueLabel ? ` · ${queueLabel}` : ""}
          </p>
          <h3 className="mt-1 font-display text-2xl text-ink">
            Drag the box to choose what fills the frame
          </h3>
          <p className="mt-1 font-body text-sm text-stone">
            Everything inside the box is stretched to fill the landscape tile. Leave it
            on the whole photo to show all of it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr] sm:items-start">
          {/* Selection area over the full image */}
          <div
            ref={workRef}
            className="relative w-full select-none overflow-hidden rounded-sm bg-ink"
            style={{ touchAction: "none" }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.src}
                alt="Select region"
                draggable={false}
                className="block w-full select-none"
                style={{ height: "auto", pointerEvents: "none" }}
                onLoad={measure}
              />
            )}
            {disp.w > 0 && (
              <div
                className="absolute cursor-move"
                style={{
                  left: sel.x,
                  top: sel.y,
                  width: sel.w,
                  height: sel.h,
                  border: "2px solid #C9A961",
                  boxShadow: "0 0 0 9999px rgba(14,17,20,0.55)",
                  touchAction: "none",
                }}
                onPointerDown={(e) => beginDrag("move", e)}
              >
                {HANDLES.map((h) => (
                  <span
                    key={h}
                    style={{ ...handleStyle, ...handlePos[h] }}
                    onPointerDown={(e) => beginDrag(h, e)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Live preview of exactly what the tile will show */}
          <div>
            <p className="mb-2 font-body text-[10px] uppercase tracking-[0.25em] text-stone">
              Tile preview
            </p>
            <div
              className="relative w-full overflow-hidden rounded-sm bg-cream"
              style={{ aspectRatio: `${CROP_ASPECT}` }}
            >
              {img && disp.w > 0 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.src}
                  alt="Tile preview"
                  draggable={false}
                  className="absolute left-0 top-0 max-w-none"
                  style={{
                    width: `${(disp.w / sel.w) * 100}%`,
                    height: `${(disp.h / sel.h) * 100}%`,
                    transform: `translate(${(-sel.x / sel.w) * 100}%, ${(-sel.y / sel.h) * 100}%)`,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy || !img}
            className="bg-gold px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-ivory disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Use This Frame"}
          </button>
          <button
            type="button"
            onClick={() => setSel({ x: 0, y: 0, w: disp.w, h: disp.h })}
            disabled={busy}
            className="border border-ink/25 px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-ink disabled:opacity-50"
          >
            Whole Photo
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="border border-ink/25 px-6 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-ink disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
