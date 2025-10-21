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
    frameSize: {
      width: 400,
      height: 600,
    },
    slotPositions: [
      { index: 0, top: 68, left: 36, width: 150, height: 206, borderRadius: 18 },
      { index: 1, top: 68, left: 214, width: 150, height: 206, borderRadius: 18 },
      { index: 2, top: 300, left: 36, width: 150, height: 206, borderRadius: 18 },
      { index: 3, top: 300, left: 214, width: 150, height: 206, borderRadius: 18 },
    ],
  },
  {
    id: "black-frame-1",
    name: "Black Frame 1",
    thumbnail: "/frames/black-frame-1.png",
    frameLayout: 1,
    dogSlots: [0],
    userSlots: [1, 2, 3],
    backgroundColor: "#0F0F0F",
    borderColor: "#FFFFFF",
    frameSize: {
      width: 400,
      height: 600,
    },
    slotPositions: [
      { index: 0, top: 68, left: 36, width: 150, height: 206, borderRadius: 18 },
      { index: 1, top: 68, left: 214, width: 150, height: 206, borderRadius: 18 },
      { index: 2, top: 300, left: 36, width: 150, height: 206, borderRadius: 18 },
      { index: 3, top: 300, left: 214, width: 150, height: 206, borderRadius: 18 },
    ],
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
    frameSize: {
      width: 200,
      height: 600,
    },
    slotPositions: [
      { index: 0, top: 40, left: 20, width: 160, height: 120, borderRadius: 18 },
      { index: 1, top: 180, left: 20, width: 160, height: 120, borderRadius: 18 },
      { index: 2, top: 320, left: 20, width: 160, height: 120, borderRadius: 18 },
      { index: 3, top: 460, left: 20, width: 160, height: 120, borderRadius: 18 },
    ],
  },
  {
    id: "black-frame-2",
    name: "Black Frame 2",
    thumbnail: "/frames/black-frame-2.png",
    frameLayout: 2,
    dogSlots: [0],
    userSlots: [1, 2, 3],
    backgroundColor: "#0F0F0F",
    borderColor: "#FFFFFF",
    frameSize: {
      width: 200,
      height: 600,
    },
    slotPositions: [
      { index: 0, top: 40, left: 20, width: 160, height: 120, borderRadius: 18 },
      { index: 1, top: 180, left: 20, width: 160, height: 120, borderRadius: 18 },
      { index: 2, top: 320, left: 20, width: 160, height: 120, borderRadius: 18 },
      { index: 3, top: 460, left: 20, width: 160, height: 120, borderRadius: 18 },
    ],
  },
];
