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
      { index: 0, top: 14, left: 14, width: 179, height: 241, borderRadius: 0 },
      { index: 1, top: 14, left: 207, width: 179, height: 241, borderRadius: 0 },
      { index: 2, top: 269, left: 14, width: 179, height: 241, borderRadius: 0 },
      { index: 3, top: 269, left: 207, width: 179, height: 241, borderRadius: 0 },
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
      { index: 0, top: 14, left: 14, width: 179, height: 241, borderRadius: 0 },
      { index: 1, top: 14, left: 207, width: 179, height: 241, borderRadius: 0 },
      { index: 2, top: 269, left: 14, width: 179, height: 241, borderRadius: 0 },
      { index: 3, top: 269, left: 207, width: 179, height: 241, borderRadius: 0 },
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
      { index: 0, top: 10.5, left: 10.5, width: 179, height: 120.5, borderRadius: 0 },
      { index: 1, top: 141.5, left: 10.5, width: 179, height: 120.5, borderRadius: 0 },
      { index: 2, top: 272.5, left: 10.5, width: 179, height: 120.5, borderRadius: 0 },
      { index: 3, top: 403.5, left: 10.5, width: 179, height: 120.5, borderRadius: 0 },
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
      { index: 0, top: 10.5, left: 10.5, width: 179, height: 120.5, borderRadius: 0 },
      { index: 1, top: 141.5, left: 10.5, width: 179, height: 120.5, borderRadius: 0 },
      { index: 2, top: 272.5, left: 10.5, width: 179, height: 120.5, borderRadius: 0 },
      { index: 3, top: 403.5, left: 10.5, width: 179, height: 120.5, borderRadius: 0 },
    ],
  },
];
