export const DRIVE_FILES = {
  TCE_PDF:         '155MQby7jWZ7xqkA9n0xvcfnhKAzf01Sb',
  AVE_PDF:         '1S2Rha4MbX9UC0ns9Do2Hb1H70RUyGAyJ',
  CEFALEIA_PDF:    '18gtrknfggsayUMs5LC8Lgupgrt_bXYOG',
  PARKINSON_PPTX:  '1jxItWMQuJA8DjlyuxR1wlGYebiXVBErL',
  QUIZ_CVCC_PPTX:  '1g7tRH534321Gpi_-6acHmqbmORvCL2Jn',
  RESUMAO_PDF:     '17uTch6TFkhrft0NVYIW94vim43zbBPo-',
  HOSPITAL_TRAUMA_PPTX: '1PzyjWReQrDFMN6ZNUQhBxiscIPA2uHnl',
  AVC_PPTX:        '1KLsdBwEAO_Mn6ewTyV7xAEktXzME-Ysa',
} as const;

export function getDrivePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function getDriveThumbnailUrl(fileId: string, size = 800): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}
