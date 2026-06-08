/**
 * Gera URLs para imagens hospedadas no Google Drive.
 * Os arquivos precisam estar com permissão "qualquer pessoa com o link pode ver".
 */

export type DriveImageSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<DriveImageSize, string> = {
  sm:  'w400',
  md:  'w800',
  lg:  'w1200',
  xl:  'w2000',
};

export function getDriveThumbnailUrl(fileId: string, size: DriveImageSize = 'md'): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${SIZE_MAP[size]}`;
}

export function getDriveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function isDriveId(src: string): boolean {
  // IDs do Drive têm entre 25-45 caracteres alfanuméricos + hífens/underscores
  return /^[a-zA-Z0-9_-]{25,45}$/.test(src);
}
