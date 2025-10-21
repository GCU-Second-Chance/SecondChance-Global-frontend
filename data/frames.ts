/**
 * Frame Templates Data
 * Mock data for photo frame layouts
 */

import type { Frame } from "@/stores/types";

export const frames: Frame[] = [
  {
    id: "white-frame-1",
    name: "White Frame 1",
    thumbnail: "/frames/white-frame-1.png",
    frameLayout: 1,
    dogSlots: [0],
    userSlots: [1, 2, 3],
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
  },
  {
    id: "white-frame-2",
    name: "White Frame 2",
    thumbnail: "/frames/white-frame-2.png",
    frameLayout: 2,
    dogSlots: [0],
    userSlots: [1, 2, 3],
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
  },
];
