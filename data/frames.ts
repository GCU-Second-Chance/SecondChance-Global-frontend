/**
 * Frame Templates Data
 * Mock data for photo frame layouts
 */

import type { Frame } from "@/stores/types";

export const frames: Frame[] = [
  {
    id: "frame_2x2",
    name: "Classic Grid",
    thumbnail: "/frames/2x2.svg",
    template: "2x2",
    dogSlots: [0], // Top-left
    userSlots: [1, 2, 3], // Top-right, Bottom-left, Bottom-right
  },
  {
    id: "frame_4x1",
    name: "Vertical Strip",
    thumbnail: "/frames/4x1.svg",
    template: "4x1",
    dogSlots: [0], // First slot
    userSlots: [1, 2, 3], // Remaining 3 slots
  },
  {
    id: "frame_1x4",
    name: "Horizontal Strip",
    thumbnail: "/frames/1x4.svg",
    template: "1x4",
    dogSlots: [0], // First slot
    userSlots: [1, 2, 3], // Remaining 3 slots
  },
];
