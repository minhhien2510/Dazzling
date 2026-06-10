import type { FrameOption, LayoutType } from '../../types/photobooth';
import { getFilterById } from './filters';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function composePhotostrip(
  photos: string[],
  layout: LayoutType,
  frame: FrameOption,
  filterId: string,
): Promise<string> {
  const filter = getFilterById(filterId);
  const imageWidth = 720;
  const imageHeight = 540;
  const padding = 32;
  const margin = 76;

  let canvasWidth: number;
  let canvasHeight: number;

  if (layout === '1x4') {
    canvasWidth = imageWidth + padding * 2;
    canvasHeight = imageHeight * 4 + padding * 5 + margin;
  } else {
    canvasWidth = imageWidth * 2 + padding * 3;
    canvasHeight = imageHeight * 2 + padding * 3 + margin;
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  ctx.fillStyle = frame.color;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const images = await Promise.all(photos.map(loadImage));

  images.forEach((img, i) => {
    let x: number;
    let y: number;
    if (layout === '1x4') {
      x = padding;
      y = padding + i * (imageHeight + padding);
    } else {
      x = padding + (i % 2) * (imageWidth + padding);
      y = padding + Math.floor(i / 2) * (imageHeight + padding);
    }
    ctx.filter = filter.cssFilter;
    ctx.drawImage(img, x, y, imageWidth, imageHeight);
  });

  ctx.filter = 'none';
  ctx.fillStyle = frame.textColor;
  ctx.font = 'bold 34px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DAZZLING', canvasWidth / 2, canvasHeight - 42);

  ctx.font = '18px Inter, system-ui, sans-serif';
  ctx.globalAlpha = 0.65;
  ctx.fillText(new Date().toLocaleDateString('vi-VN'), canvasWidth / 2, canvasHeight - 18);
  ctx.globalAlpha = 1;

  return canvas.toDataURL('image/png');
}
