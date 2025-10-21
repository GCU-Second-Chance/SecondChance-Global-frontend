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

  const restoreImages = await inlineImageSources(imgs);

  // 3) 레이아웃 안정화
  await new Promise((r) => requestAnimationFrame(() => r(null)));

  try {
    // 4) 캡처
    return await htmlToImage.toPng(node, {
      pixelRatio, // 화질(픽셀 수) ↑
      cacheBust: false,
      style: { transform: "none" }, // 스케일·트랜스폼 제거
      fetchRequestInit: { mode: "cors", credentials: "omit" },
      filter: buildNodeFilter(excludeSelectors), // << 특정 요소 제외
    });
  } finally {
    restoreImages?.();
  }
}

async function inlineImageSources(imgs: HTMLImageElement[]) {
  const originals: Array<{ img: HTMLImageElement; src: string; srcset: string }> = [];

  const toDataUrl = async (img: HTMLImageElement) => {
    const src = img.currentSrc || img.src;
    if (!src || src.startsWith("data:")) {
      return null;
    }

    try {
      const response = await fetch(src, { mode: "cors", credentials: "omit" });
      if (!response.ok) {
        return null;
      }

      const blob = await response.blob();
      const reader = new FileReader();

      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error ?? new Error("Failed to read blob"));
        reader.readAsDataURL(blob);
      });

      return dataUrl;
    } catch (error) {
      console.warn("[capture] Failed to inline image", { src: img.src, error });
      return null;
    }
  };

  await Promise.all(
    imgs.map(async (img) => {
      const inlinedSrc = await toDataUrl(img);
      if (!inlinedSrc) {
        return;
      }

      originals.push({
        img,
        src: img.getAttribute("src") ?? "",
        srcset: img.getAttribute("srcset") ?? "",
      });

      img.setAttribute("srcset", "");
      img.setAttribute("src", inlinedSrc);

      if (!img.complete) {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      }
    })
  );

  return () => {
    originals.forEach(({ img, src, srcset }) => {
      if (srcset) {
        img.setAttribute("srcset", srcset);
      } else {
        img.removeAttribute("srcset");
      }
      if (src) {
        img.setAttribute("src", src);
      }
    });
  };
}
