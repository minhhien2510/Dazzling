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

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const sourceRatio = img.width / img.height;
  const targetRatio = width / height;

  let sourceWidth = img.width;
  let sourceHeight = img.height;
  let sourceX = 0;
  let sourceY = 0;

  if (sourceRatio > targetRatio) {
    sourceWidth = img.height * targetRatio;
    sourceX = (img.width - sourceWidth) / 2;
  } else {
    sourceHeight = img.width / targetRatio;
    sourceY = (img.height - sourceHeight) / 2;
  }

  ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

export async function composePhotostrip(
  photos: string[],
  layout: LayoutType,
  frame: FrameOption,
  filterId: string,
): Promise<string> {
  const filter = getFilterById(filterId);
  const imageWidth = layout === '1x4' ? 640 : 620;
  const imageHeight = layout === '1x4' ? 720 : 620;
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
    drawImageCover(ctx, img, x, y, imageWidth, imageHeight);
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
