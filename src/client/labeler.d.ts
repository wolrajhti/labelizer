export interface Label {
  x: number;
  y: number;
  name: string;
  widht: number;
  height: number;
}

export interface Anchor {
  x: number;
  y: number;
  r: number;
}

interface labeler {
  label(label_array: Label[]): labeler;
  anchor(anchor_array: Anchor[]): labeler;
  width(w: number): labeler;
  height(h: number): labeler;
  start(nsweeps: number): labeler;
}
export function labeler(): labeler;