import { useState } from 'react';
import { ImageOff, ExternalLink } from 'lucide-react';
import { getDrivePreviewUrl } from '../services/driveImages';

interface DriveImageProps {
  fileId: string;
  alt: string;
  caption?: string;
  height?: number;
}

export function DriveImage({ fileId, alt, caption, height = 300 }: DriveImageProps) {
  const [error, setError] = useState(false);
  const previewUrl = getDrivePreviewUrl(fileId);

  if (error) {
    return (
      <figure className="my-4 rounded-xl overflow-hidden border border-brand-border bg-brand-surface flex flex-col items-center justify-center gap-2 py-8">
        <ImageOff size={32} className="text-brand-muted" />
        <p className="text-brand-muted text-sm">Imagem indisponível</p>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-brand-accent text-xs hover:underline"
        >
          Abrir no Google Drive <ExternalLink size={12} />
        </a>
      </figure>
    );
  }

  return (
    <figure className="my-4 rounded-xl overflow-hidden border border-brand-border" style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
      <iframe
        src={previewUrl}
        className="w-full bg-gray-900"
        style={{ height }}
        title={alt}
        allow="autoplay"
        onError={() => setError(true)}
      />
      {caption && (
        <figcaption className="text-xs text-brand-muted p-2 bg-brand-surface text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
