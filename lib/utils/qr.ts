import QRCode from "qrcode";

export async function toQrDataUrl(data: string, size = 50): Promise<string> {
  return QRCode.toDataURL(data, {
    margin: 0,
    width: size,
    errorCorrectionLevel: "M",
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}
