import { useState } from 'react';
import { Maximize2, X, ImageOff } from 'lucide-react';

interface QuestionImageProps {
  type: 'drive' | 'url';
  src: string;
  caption?: string;
}

export function QuestionImage({ type, src, caption }: QuestionImageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const imageUrl =
    type === 'drive'
      ? `https://drive.google.com/thumbnail?id=${src}&sz=w1200`
      : src;

  const previewUrl =
    type === 'drive'
      ? `https://drive.google.com/thumbnail?id=${src}&sz=w800`
      : src;

  if (loadError) {
    return (
      <div className="my-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-gray-500">
        <ImageOff size={28} />
        <span>Imagem indisponível</span>
        {caption && <span className="text-xs">{caption}</span>}
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail clicável */}
      <figure className="group relative my-4 cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-black/30">
        <img
          src={previewUrl}
          alt={caption ?? 'Imagem de exame radiológico'}
          className="w-full object-contain max-h-72 transition-transform duration-200 group-hover:scale-[1.02]"
          onError={() => setLoadError(true)}
          loading="lazy"
        />
        <button
          onClick={() => setLightboxOpen(true)}
          aria-label="Ampliar imagem"
          className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <Maximize2 size={16} />
        </button>
        {caption && (
          <figcaption className="bg-black/50 px-3 py-1.5 text-center text-xs text-gray-400 backdrop-blur-sm">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Fechar"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
          <img
            src={imageUrl}
            alt={caption ?? 'Imagem ampliada'}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {caption && (
            <p className="absolute bottom-4 text-center text-sm text-gray-300">
              {caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
