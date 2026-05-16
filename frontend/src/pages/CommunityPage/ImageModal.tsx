export default function ImageModal({ 
  imageUrl, 
  onClose 
}: { 
  imageUrl: string; 
  onClose: () => void; 
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
        <button 
          onClick={onClose} 
          className="absolute -top-10 right-0 md:-right-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <img 
          src={imageUrl} 
          alt="Full screen view" 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
