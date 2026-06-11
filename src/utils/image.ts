export function dataUrlToFile(dataUrl: string, fileName: string): File {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new File([array], fileName, { type: mime });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  minQuality?: number;
  targetMaxBytes?: number;
  mimeType?: 'image/jpeg' | 'image/webp';
}

async function canvasToBlob(
  img: HTMLImageElement,
  width: number,
  height: number,
  mimeType: 'image/jpeg' | 'image/webp',
  quality: number,
): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });
}

export async function compressDataUrlToFile(
  dataUrl: string,
  fileName: string,
  {
    maxWidth = 1800,
    maxHeight = 3600,
    quality = 0.92,
    minQuality = 0.78,
    targetMaxBytes = 1_800_000,
    mimeType = 'image/jpeg',
  }: CompressImageOptions = {},
): Promise<File> {
  const img = await loadImage(dataUrl);
  const sourceWidth = img.naturalWidth || img.width;
  const sourceHeight = img.naturalHeight || img.height;
  const scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);

  const qualitySteps = [quality, 0.9, 0.86, 0.82, minQuality]
    .filter((q, index, arr) => q >= minQuality && arr.indexOf(q) === index)
    .sort((a, b) => b - a);
  const dimensionScales = [1, 0.92, 0.84, 0.76];

  let bestBlob: Blob | null = null;

  for (const dimensionScale of dimensionScales) {
    const targetWidth = Math.max(1, Math.round(width * dimensionScale));
    const targetHeight = Math.max(1, Math.round(height * dimensionScale));

    for (const currentQuality of qualitySteps) {
      const blob = await canvasToBlob(img, targetWidth, targetHeight, mimeType, currentQuality);
      if (!blob) continue;

      bestBlob = blob;
      if (blob.size <= targetMaxBytes) {
        const extension = mimeType === 'image/webp' ? 'webp' : 'jpg';
        const normalizedName = fileName.replace(/\.[^.]+$/, '') || 'dazzling-moment';
        return new File([blob], `${normalizedName}.${extension}`, { type: mimeType });
      }
    }
  }

  if (!bestBlob) {
    return dataUrlToFile(dataUrl, fileName);
  }

  const extension = mimeType === 'image/webp' ? 'webp' : 'jpg';
  const normalizedName = fileName.replace(/\.[^.]+$/, '') || 'dazzling-moment';
  return new File([bestBlob], `${normalizedName}.${extension}`, { type: mimeType });
}
