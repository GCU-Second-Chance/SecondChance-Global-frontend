// utils/capture.ts
import * as htmlToImage from "html-to-image";

export type CaptureOptions = {
  /** 캡처에서 제외할 셀렉터들(예: ['#remove', '.debug', '[data-no-capture]']) */
  excludeSelectors?: string[];
  /** 캡처 해상도 배수 (기본: min(devicePixelRatio, 2)) */
  pixelRatio?: number;
  /** 투명 배경 유지하려면 null, 색을 지정하려면 '#fff' 같은 값 */
  backgroundColor?: string | null;
};

function buildNodeFilter(excludeSelectors: string[] = []) {
  if (excludeSelectors.length === 0) return undefined;

  // html-to-image filter: true면 포함, false면 제외
  return (node: HTMLElement) => {
    // 자신 또는 조상 중 제외 셀렉터에 매칭되면 제외
    for (const sel of excludeSelectors) {
      if (node.matches?.(sel) || node.closest?.(sel)) return false;
    }
    return true;
  };
}

export async function captureNodeToPng(
  node: HTMLElement,
  opts: CaptureOptions = {}
): Promise<string> {
  const {
    excludeSelectors = [], // << 여기로 '#remove' 넣으면 됨
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2),
  } = opts;

  // 1) 폰트 준비
  const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (fontSet) {
    try {
      await fontSet.ready;
    } catch {
      // Ignore font loading errors; capture can proceed without them
    }
  }

  // 2) 이미지 decode() 대기
  const imgs = Array.from(node.querySelectorAll("img")) as HTMLImageElement[];
  await Promise.all(
    imgs.map(async (img: HTMLImageElement) => {
      if (typeof img.decode === "function") {
        try {
          await img.decode();
          return;
        } catch {
          // Fallback to load handlers below
        }
      }

      if (!img.complete) {
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = () => rej();
        });
      }
    })
  );

  // 3) 레이아웃 안정화
  await new Promise((r) => requestAnimationFrame(() => r(null)));

  // 4) 캡처
  return await htmlToImage.toPng(node, {
    pixelRatio, // 화질(픽셀 수) ↑
    cacheBust: false,
    style: { transform: "none" }, // 스케일·트랜스폼 제거
    fetchRequestInit: { mode: "cors", credentials: "omit" },
    filter: buildNodeFilter(excludeSelectors), // << 특정 요소 제외
  });
}
