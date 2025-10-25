// utils/capture.ts
import html2canvas from "html2canvas";

export type CaptureOptions = {
  /** 캡처에서 제외할 셀렉터들(예: ['#remove', '.debug', '[data-no-capture]']) */
  excludeSelectors?: string[];
  /** 캡처 해상도 배수 (기본: min(devicePixelRatio, 2)) */
  pixelRatio?: number;
  /** 투명 배경 유지하려면 null, 색을 지정하려면 '#fff' 같은 값 */
  backgroundColor?: string | null;
};

// (unused legacy helper removed)

export async function captureNodeToPng(
  node: HTMLElement,
  opts: CaptureOptions = {}
): Promise<string> {
  const {
    excludeSelectors = [], // << 여기로 '#remove' 넣으면 됨
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2),
    backgroundColor = "#fff",
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
    // 4) 캡처 (html2canvas 고정)
    const canvas = await html2canvas(node, {
      backgroundColor: backgroundColor === null ? null : backgroundColor,
      useCORS: true,
      allowTaint: false,
      scale: pixelRatio,
      logging: false,
      // 제외 요소 무시
      ignoreElements: buildIgnoreElements(excludeSelectors),
      // Tailwind의 transform(var(--tw-...))이 html2canvas에서 누락되는 문제 보정
      // 클론 DOM에 직접 transform을 주입해 좌우반전을 보장
      onclone: (clonedDoc: Document, clonedNode: HTMLElement) => {
        try {
          // 좌우 반전 클래스가 적용된 모든 노드를 찾아 인라인 transform으로 강제
          const mirrorCandidates = clonedNode.querySelectorAll(
            '[class*="scale-x-[-1]"]'
          );
          mirrorCandidates.forEach((el) => {
            const elem = el as HTMLElement;
            // 인라인 transform이 Tailwind transform보다 우선 적용됨
            elem.style.transform = "scaleX(-1)";
            elem.style.transformOrigin = "center";
          });

          // 혹시 비표준 형태로 변수만 설정된 경우도 커버 (안전 차원)
          const varScaleCandidates = clonedNode.querySelectorAll<HTMLElement>('[style*="--tw-scale-x:-1"], [style*="--tw-scale-x: -1"]');
          varScaleCandidates.forEach((elem) => {
            elem.style.transform = "scaleX(-1)";
            elem.style.transformOrigin = "center";
          });
        } catch (e) {
          // 주입 실패시에도 캡처는 계속 진행
          // eslint-disable-next-line no-console
          console.warn("[capture] onclone transform patch failed", e);
        }
      },
      // Let html2canvas use current window scroll by default
    });

    return canvas.toDataURL("image/png");
  } finally {
    restoreImages?.();
  }
}

function buildIgnoreElements(excludeSelectors: string[] = []) {
  if (excludeSelectors.length === 0) return undefined;
  return (el: Element) => {
    const node = el as HTMLElement;
    for (const sel of excludeSelectors) {
      if (node.matches?.(sel) || node.closest?.(sel)) return true; // true => 무시
    }
    return false;
  };
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
