/**
 * Canvas Renderer
 * Generates final photo frame with dog/user photos, QR code, and text layers
 */

import QRCode from "qrcode";
import type { Dog, Frame, PhotoSlot } from "@/stores/types";

interface RenderOptions {
  frame: Frame;
  photoSlots: PhotoSlot[];
  dog: Dog;
  outputWidth?: number;
  outputHeight?: number;
}

const DEFAULT_OUTPUT_SIZE = 1080; // Instagram-friendly square
const QR_SIZE = 120;
const PADDING = 20;
const GAP = 10;

/**
 * Load image from URL
 */
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Generate QR code as data URL
 */
async function generateQRCode(dogId: string): Promise<string> {
  const url = `${window.location.origin}/dog/${dogId}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: QR_SIZE,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrDataUrl;
  } catch (error) {
    console.error("QR generation error:", error);
    throw error;
  }
}

/**
 * Draw rounded rectangle
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Render 2x2 grid layout
 */
async function render2x2(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoSlots: PhotoSlot[]
) {
  const slotSize = (width - PADDING * 2 - GAP) / 2;

  for (let i = 0; i < 4; i++) {
    const slot = photoSlots[i];
    if (!slot?.imageUrl) continue;

    const img = await loadImage(slot.imageUrl);
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = PADDING + col * (slotSize + GAP);
    const y = PADDING + row * (slotSize + GAP);

    // Draw image with cover fit
    ctx.save();
    drawRoundedRect(ctx, x, y, slotSize, slotSize, 12);
    ctx.clip();

    const imgAspect = img.width / img.height;
    const slotAspect = 1;

    let drawWidth = slotSize;
    let drawHeight = slotSize;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > slotAspect) {
      drawWidth = slotSize * (imgAspect / slotAspect);
      offsetX = -(drawWidth - slotSize) / 2;
    } else {
      drawHeight = slotSize * (slotAspect / imgAspect);
      offsetY = -(drawHeight - slotSize) / 2;
    }

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
    ctx.restore();
  }
}

/**
 * Render 4x1 vertical layout
 */
async function render4x1(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoSlots: PhotoSlot[]
) {
  const slotWidth = width - PADDING * 2;
  const slotHeight = (height - PADDING * 2 - GAP * 3) / 4;

  for (let i = 0; i < 4; i++) {
    const slot = photoSlots[i];
    if (!slot?.imageUrl) continue;

    const img = await loadImage(slot.imageUrl);
    const x = PADDING;
    const y = PADDING + i * (slotHeight + GAP);

    // Draw image with cover fit
    ctx.save();
    drawRoundedRect(ctx, x, y, slotWidth, slotHeight, 12);
    ctx.clip();

    const imgAspect = img.width / img.height;
    const slotAspect = slotWidth / slotHeight;

    let drawWidth = slotWidth;
    let drawHeight = slotHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > slotAspect) {
      drawWidth = slotHeight * imgAspect;
      offsetX = -(drawWidth - slotWidth) / 2;
    } else {
      drawHeight = slotWidth / imgAspect;
      offsetY = -(drawHeight - slotHeight) / 2;
    }

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
    ctx.restore();
  }
}

/**
 * Render 1x4 horizontal layout
 */
async function render1x4(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoSlots: PhotoSlot[]
) {
  const slotWidth = (width - PADDING * 2 - GAP * 3) / 4;
  const slotHeight = height - PADDING * 2;

  for (let i = 0; i < 4; i++) {
    const slot = photoSlots[i];
    if (!slot?.imageUrl) continue;

    const img = await loadImage(slot.imageUrl);
    const x = PADDING + i * (slotWidth + GAP);
    const y = PADDING;

    // Draw image with cover fit
    ctx.save();
    drawRoundedRect(ctx, x, y, slotWidth, slotHeight, 12);
    ctx.clip();

    const imgAspect = img.width / img.height;
    const slotAspect = slotWidth / slotHeight;

    let drawWidth = slotWidth;
    let drawHeight = slotHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > slotAspect) {
      drawWidth = slotHeight * imgAspect;
      offsetX = -(drawWidth - slotWidth) / 2;
    } else {
      drawHeight = slotWidth / imgAspect;
      offsetY = -(drawHeight - slotHeight) / 2;
    }

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
    ctx.restore();
  }
}

/**
 * Add QR code overlay
 */
async function addQRCode(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dogId: string
) {
  const qrDataUrl = await generateQRCode(dogId);
  const qrImg = await loadImage(qrDataUrl);

  const qrX = width - QR_SIZE - PADDING;
  const qrY = height - QR_SIZE - PADDING;

  // White background for QR
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(qrX - 5, qrY - 5, QR_SIZE + 10, QR_SIZE + 10);

  // Draw QR code
  ctx.drawImage(qrImg, qrX, qrY, QR_SIZE, QR_SIZE);
}

/**
 * Add text layers (dog name, hashtags, shelter)
 */
function addTextLayers(ctx: CanvasRenderingContext2D, width: number, height: number, dog: Dog) {
  ctx.textBaseline = "bottom";

  // Dog name (bottom left)
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 4;
  ctx.font = "bold 32px system-ui, -apple-system, sans-serif";

  const nameX = PADDING;
  const nameY = height - PADDING - QR_SIZE + 30;

  ctx.strokeText(dog.name, nameX, nameY);
  ctx.fillText(dog.name, nameX, nameY);

  // Hashtags (above dog name)
  ctx.font = "16px system-ui, -apple-system, sans-serif";
  const hashtags = "#SecondChanceGlobal #AdoptDontShop";
  const hashtagY = nameY - 40;

  ctx.strokeText(hashtags, nameX, hashtagY);
  ctx.fillText(hashtags, nameX, hashtagY);

  // Shelter name (above hashtags)
  ctx.font = "14px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#FFFFFF";
  const shelterText = dog.shelter.name;
  const shelterY = hashtagY - 25;

  ctx.strokeText(shelterText, nameX, shelterY);
  ctx.fillText(shelterText, nameX, shelterY);
}

/**
 * Main render function
 * Generates final canvas with all elements
 */
export async function renderPhotoFrame(options: RenderOptions): Promise<string> {
  const { frame, photoSlots, dog, outputWidth = DEFAULT_OUTPUT_SIZE } = options;
  const outputHeight = outputWidth; // Square output for now

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // White background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, outputWidth, outputHeight);

  // Render photo layout based on template
  switch (frame.template) {
    case "2x2":
      await render2x2(ctx, outputWidth, outputHeight, photoSlots);
      break;
    case "4x1":
      await render4x1(ctx, outputWidth, outputHeight, photoSlots);
      break;
    case "1x4":
      await render1x4(ctx, outputWidth, outputHeight, photoSlots);
      break;
  }

  // Add QR code
  await addQRCode(ctx, outputWidth, outputHeight, dog.id);

  // Add text layers
  addTextLayers(ctx, outputWidth, outputHeight, dog);

  // Convert to data URL
  return canvas.toDataURL("image/png", 1.0);
}

/**
 * Download image from data URL
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
