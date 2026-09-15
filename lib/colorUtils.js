/**
 * Intelligent color extraction from images (logos, brand graphics)
 * Analyzes image pixel data to identify the top 3 dominant, distinctive brand colors.
 */

export function rgbToHex(r, g, b) {
  const toHex = (c) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToRgb(hex) {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ];
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

export function colorDistance(rgb1, rgb2) {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

/**
 * Extracts the top 3 dominant and harmonious colors from an image source
 * @param {string} imageSrc Data URL or image URL
 * @param {number} count Number of colors (default: 3)
 * @returns {Promise<string[]>} Array of hex color strings (e.g. ['#1D4ED8', '#0D9488', '#F59E0B'])
 */
export function extractDominantColors(imageSrc, count = 3) {
  return new Promise((resolve) => {
    if (!imageSrc || typeof window === 'undefined') {
      resolve(['#6366F1', '#EC4899', '#10B981']);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(['#6366F1', '#EC4899', '#10B981']);
          return;
        }

        const size = 100;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imgData = ctx.getImageData(0, 0, size, size);
        const data = imgData.data;
        const colorMap = new Map();

        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 60) continue; // Skip transparency

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Skip pure white/near-white backgrounds (e.g., > 242)
          if (r > 242 && g > 242 && b > 242) continue;
          // Skip pure black/near-black backgrounds (e.g., < 18)
          if (r < 18 && g < 18 && b < 18) continue;

          // Quantize to bins of 16 to group similar colors
          const qr = Math.round(r / 16) * 16;
          const qg = Math.round(g / 16) * 16;
          const qb = Math.round(b / 16) * 16;
          const key = `${Math.min(255, qr)},${Math.min(255, qg)},${Math.min(255, qb)}`;

          colorMap.set(key, (colorMap.get(key) || 0) + 1);
        }

        // If no colors found (e.g., all black or white or transparent), fallback to looser filter
        if (colorMap.size === 0) {
          for (let i = 0; i < data.length; i += 4) {
            const a = data[i + 3];
            if (a < 30) continue;
            const qr = Math.round(data[i] / 16) * 16;
            const qg = Math.round(data[i] / 16) * 16;
            const qb = Math.round(data[i] / 16) * 16;
            const key = `${Math.min(255, qr)},${Math.min(255, qg)},${Math.min(255, qb)}`;
            colorMap.set(key, (colorMap.get(key) || 0) + 1);
          }
        }

        if (colorMap.size === 0) {
          resolve(['#6366F1', '#EC4899', '#10B981']);
          return;
        }

        // Score colors: count * (1 + saturation * 2.2) * lightness balance
        const scoredColors = [];
        colorMap.forEach((countVal, key) => {
          const rgb = key.split(',').map(Number);
          const [, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
          const saturationBonus = 1 + s * 2.5;
          const lightnessMultiplier = (l < 0.08 || l > 0.92) ? 0.4 : (l >= 0.25 && l <= 0.75 ? 1.3 : 1.0);
          const score = countVal * saturationBonus * lightnessMultiplier;

          scoredColors.push({
            rgb,
            count: countVal,
            score,
            hsl: [0, s, l]
          });
        });

        scoredColors.sort((a, b) => b.score - a.score);

        // Pick top distinctive colors (ensure minimum Euclidean distance in RGB space)
        const selected = [];
        const minDistanceThreshold = 65;

        for (const candidate of scoredColors) {
          if (selected.length >= count) break;
          const isDistinct = selected.every(
            sel => colorDistance(sel.rgb, candidate.rgb) >= minDistanceThreshold
          );
          if (isDistinct) {
            selected.push(candidate);
          }
        }

        // If not enough distinct colors, lower threshold
        if (selected.length < count) {
          for (const candidate of scoredColors) {
            if (selected.length >= count) break;
            if (!selected.includes(candidate)) {
              const isDistinct = selected.every(
                sel => colorDistance(sel.rgb, candidate.rgb) >= 35
              );
              if (isDistinct) {
                selected.push(candidate);
              }
            }
          }
        }

        // If still fewer than count, generate complementary/accent variations based on primary
        const resultHex = selected.map(c => rgbToHex(c.rgb[0], c.rgb[1], c.rgb[2]));

        if (resultHex.length === 0) {
          resultHex.push('#6366F1');
        }

        if (resultHex.length < count) {
          const primaryRgb = hexToRgb(resultHex[0]);
          const [h, s, l] = rgbToHsl(primaryRgb[0], primaryRgb[1], primaryRgb[2]);

          const harmonies = [
            (h + 0.33) % 1, // triadic 1
            (h + 0.66) % 1, // triadic 2
            (h + 0.5) % 1   // complementary
          ];

          for (const harmH of harmonies) {
            if (resultHex.length >= count) break;
            const harmRgb = hslToRgb(harmH, Math.max(0.6, s), Math.max(0.4, Math.min(0.6, l)));
            const harmHex = rgbToHex(harmRgb[0], harmRgb[1], harmRgb[2]);
            if (!resultHex.includes(harmHex)) {
              resultHex.push(harmHex);
            }
          }
        }

        // Fill remaining with modern brand palette defaults
        const defaults = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#06B6D4'];
        for (const def of defaults) {
          if (resultHex.length >= count) break;
          if (!resultHex.includes(def)) {
            resultHex.push(def);
          }
        }

        resolve(resultHex.slice(0, count));
      } catch (err) {
        console.error('Error in extractDominantColors:', err);
        resolve(['#6366F1', '#EC4899', '#10B981']);
      }
    };

    img.onerror = () => {
      resolve(['#6366F1', '#EC4899', '#10B981']);
    };

    img.src = imageSrc;
  });
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
