import { useState } from 'react';
import { Maximize2, X, ImageOff, Loader2 } from 'lucide-react';

interface QuestionImageProps {
  url: string;
  caption?: string | null;
}

export function QuestionImage({ url, caption }: QuestionImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (status === 'error') {
    return (
      <div className="my-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-gray-500">
        <ImageOff size={24} />
        <span>Imagem indisponível</span>
        {caption && <span className="text-xs text-center">{caption}</span>}
      </div>
    );
  }

  return (
    <>
      <figure className="group relative my-4 cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-black/40">
        {/* Skeleton enquanto carrega */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 min-h-[120px]">
            <Loader2 size={24} className="animate-spin text-indigo-400" />
          </div>
        )}

        <img
          src={url}
          alt={caption ?? 'Imagem de exame radiológico'}
          className={`w-full object-contain max-h-72 transition-all duration-200 group-hover:scale-[1.02] ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0 h-0'
          }`}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          loading="lazy"
        />

        {status === 'loaded' && (
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="Ampliar imagem"
            className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
          >
            <Maximize2 size={15} />
          </button>
        )}

        {caption && status === 'loaded' && (
          <figcaption className="bg-black/50 px-3 py-1.5 text-center text-xs text-gray-400 backdrop-blur-sm">
            {caption}
          </figcaption>
        )}
      </figure>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Fechar"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          <img
            src={url}
            alt={caption ?? 'Imagem ampliada'}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {caption && (
            <p className="absolute bottom-6 text-center text-sm text-gray-300 px-4">
              {caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
