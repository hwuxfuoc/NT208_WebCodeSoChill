import { useState, useEffect } from "react";
import ModalPortal from "../../components/ModalPortal";

export default function ImageModal({ 
  imageUrl, 
  onClose 
}: { 
  imageUrl: string; 
  onClose: () => void; 
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // No need for overflow hidden useEffect here because ModalPortal already handles it

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY < 0) {
      // scroll up -> zoom in
      setScale(s => Math.min(s + 0.25, 4));
    } else {
      // scroll down -> zoom out
      setScale(s => Math.max(s - 0.25, 0.5));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default image drag
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[2010]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <img 
            src={imageUrl} 
            alt="Full screen view" 
            className={`max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-100 ease-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>
    </ModalPortal>
  );
}
