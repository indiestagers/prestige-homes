"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Fixed landscape frame the admin positions each photo into.
export const CROP_ASPECT = 4 / 3;
const OUTPUT_WIDTH = 1600;
const MAX_ZOOM = 4;

type Offset = { x: number; y: number };

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
  const frameRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(
    null,
  );

  // Load the selected file into an <img> we can measure and draw.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Measure the frame (it's responsive) so the transform math is exact.
  useEffect(() => {
    const measure = () => {
      const el = frameRef.current;
      if (!el) return;
      const w = el.clientWidth;
      setFrameSize({ w, h: w / CROP_ASPECT });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [img]);

  // Scale that makes the image exactly cover the frame at zoom = 1.
  const coverScale =
    img && frameSize.w
      ? Math.max(frameSize.w / img.naturalWidth, frameSize.h / img.naturalHeight)
      : 1;
  const scale = coverScale * zoom;
  const displayW = img ? img.naturalWidth * scale : 0;
  const displayH = img ? img.naturalHeight * scale : 0;

  // Keep the image covering the frame — never let a gap show.
  const clamp = useCallback(
    (next: Offset): Offset => {
      const minX = frameSize.w - displayW;
      const minY = frameSize.h - displayH;
      return {
        x: Math.min(0, Math.max(minX, next.x)),
        y: Math.min(0, Math.max(minY, next.y)),
      };
    },
    [frameSize.w, frameSize.h, displayW, displayH],
  );

  // Re-clamp whenever zoom or sizing changes.
  useEffect(() => {
    setOffset((current) => clamp(current));
  }, [clamp]);

  function onPointerDown(event: React.PointerEvent) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: offset.x,
      baseY: offset.y,
    };
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    setOffset(clamp({ x: dragRef.current.baseX + dx, y: dragRef.current.baseY + dy }));
  }

  function onPointerUp(event: React.PointerEvent) {
    dragRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // pointer already released
    }
  }

  function onWheel(event: React.WheelEvent) {
    event.preventDefault();
    setZoom((current) =>
      Math.min(MAX_ZOOM, Math.max(1, current - event.deltaY * 0.0015)),
    );
  }

  function handleConfirm() {
    if (!img || !frameSize.w) return;
    // Map the visible frame back to source-image pixels.
    const sx = -offset.x / scale;
    const sy = -offset.y / scale;
    const sw = frameSize.w / scale;
    const sh = frameSize.h / scale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_WIDTH;
    canvas.height = Math.round(OUTPUT_WIDTH / CROP_ASPECT);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) onComplete(blob);
      },
      "image/jpeg",
      0.9,
    );
  }

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-ink/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-sm bg-ivory p-5 shadow-2xl">
        <div className="mb-4">
          <p className="font-body text-[11px] uppercase tracking-[0.35em] text-gold">
            Position Photo{queueLabel ? ` · ${queueLabel}` : ""}
          </p>
          <h3 className="mt-1 font-display text-2xl text-ink">
            Drag to move, zoom to fill the frame
          </h3>
        </div>

        <div
          ref={frameRef}
          className="relative w-full overflow-hidden rounded-sm bg-ink select-none"
          style={{ aspectRatio: `${CROP_ASPECT}`, touchAction: "none", cursor: "move" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
        >
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img.src}
              alt="Crop preview"
              draggable={false}
              className="absolute max-w-none select-none"
              style={{
                left: `${offset.x}px`,
                top: `${offset.y}px`,
                width: `${displayW}px`,
                height: `${displayH}px`,
              }}
            />
          )}
          {/* subtle rule-of-thirds guide */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-ivory/15" />
            ))}
          </div>
        </div>

        <label className="mt-5 block font-body text-xs font-semibold uppercase tracking-[0.2em] text-stone">
          Zoom
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="mt-2 block w-full accent-gold"
          />
        </label>

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
