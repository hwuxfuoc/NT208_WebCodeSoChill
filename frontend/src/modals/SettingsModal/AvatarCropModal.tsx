import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AvatarCropModalProps {
  imageDataUrl: string;
  onConfirm: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function AvatarCropModal({ imageDataUrl, onConfirm, onCancel }: AvatarCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const CROP_SIZE = 300;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const minScale = Math.max(CROP_SIZE / img.width, CROP_SIZE / img.height);
      setScale(minScale);
      setOffset({ x: 0, y: 0 });
    };
    img.src = imageDataUrl;
  }, [imageDataUrl]);

  useEffect(() => {
    draw();
  }, [scale, offset]);

  const draw = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = (CROP_SIZE - drawW) / 2 + offset.x;
    const y = (CROP_SIZE - drawH) / 2 + offset.y;
    ctx.drawImage(img, x, y, drawW, drawH);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
  };

  const handleMouseUp = () => setDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.max(0.5, Math.min(4, s - e.deltaY * 0.001)));
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) onConfirm(blob);
    }, "image/jpeg", 0.9);
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 1000 }} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-host" style={{ zIndex: 1001 }}>
        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{ width: 380, pointerEvents: "auto" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h3 className="text-base font-extrabold text-[#1A1D2B]">Crop Photo</h3>
            <p className="text-xs text-gray-400 mt-1">Drag to reposition · Scroll to zoom</p>
          </div>

          <div className="p-5 flex flex-col items-center gap-4">
            <div
              style={{ width: CROP_SIZE, height: CROP_SIZE, borderRadius: "50%", overflow: "hidden", cursor: dragging ? "grabbing" : "grab", boxShadow: "0 0 0 3px var(--main-orange-color)" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <canvas ref={canvasRef} width={CROP_SIZE} height={CROP_SIZE} />
            </div>

            <div className="w-full flex items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="range"
                min="0.3"
                max="4"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="flex-1 accent-orange-500"
              />
              <span className="text-xs text-gray-400 w-10 text-right">{Math.round(scale * 100)}%</span>
            </div>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--main-orange-color)" }}
            >
              Apply
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
