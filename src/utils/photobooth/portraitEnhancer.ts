function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function sharpenImageData(imageData: ImageData, amount = 0.32): ImageData {
  const { data, width, height } = imageData;
  const output = new Uint8ClampedArray(data);

  // Mild unsharp-style kernel: restores micro-detail without plastic skin smoothing.
  const center = 1 + 4 * amount;
  const side = -amount;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const up = ((y - 1) * width + x) * 4;
      const down = ((y + 1) * width + x) * 4;
      const left = (y * width + x - 1) * 4;
      const right = (y * width + x + 1) * 4;

      for (let c = 0; c < 3; c++) {
        const value =
          data[idx + c] * center +
          data[up + c] * side +
          data[down + c] * side +
          data[left + c] * side +
          data[right + c] * side;
        output[idx + c] = Math.max(0, Math.min(255, value));
      }
    }
  }

  return new ImageData(output, width, height);
}

function applyNaturalClarity(imageData: ImageData): ImageData {
  const { data } = imageData;
  const contrast = 1.045;
  const saturation = 1.025;
  const brightness = 2;

  for (let i = 0; i < data.length; i += 4) {
    let r = (data[i] - 128) * contrast + 128 + brightness;
    let g = (data[i + 1] - 128) * contrast + 128 + brightness;
    let b = (data[i + 2] - 128) * contrast + 128 + brightness;

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = luma + (r - luma) * saturation;
    g = luma + (g - luma) * saturation;
    b = luma + (b - luma) * saturation;

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  return imageData;
}

export async function enhancePortraitDataUrl(src: string): Promise<string> {
  const img = await loadImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return src;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const clarified = applyNaturalClarity(imageData);
  const sharpened = sharpenImageData(clarified);
  ctx.putImageData(sharpened, 0, 0);

  return canvas.toDataURL('image/jpeg', 0.96);
}
