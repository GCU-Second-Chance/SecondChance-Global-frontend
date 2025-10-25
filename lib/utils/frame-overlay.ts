export type OverlayConfig = {
  // Fixed pixel height of the bottom band inside the frame (e.g., 90px for 600px-high frame)
  bandHeightPx: number;
  // Portion of the band height that QR box should occupy (1 = fill band height)
  qrBoxRatio: number;
  // Pixel size used when generating QR data URL for sharpness
  qrGeneratePx: number;
};

export const DEFAULT_OVERLAY_CONFIG: OverlayConfig = {
  bandHeightPx: 90,
  qrBoxRatio: 1,
  qrGeneratePx: 160,
};

export function getOverlayLayout(
  frameSize: { width: number; height: number },
  overrides?: Partial<OverlayConfig>
) {
  const cfg: OverlayConfig = { ...DEFAULT_OVERLAY_CONFIG, ...(overrides ?? {}) };
  const bandHeightPercent = (cfg.bandHeightPx / frameSize.height) * 100;

  const bandStyle: React.CSSProperties = {
    height: `${bandHeightPercent}%`,
  };

  const qrContainerStyle: React.CSSProperties = {
    height: cfg.qrBoxRatio >= 1 ? "100%" : `${cfg.qrBoxRatio * 100}%`,
    aspectRatio: "1 / 1",
  };

  return { cfg, bandStyle, qrContainerStyle };
}
