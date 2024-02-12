export const ProductType = {
  BREAD: "panes",
  TALITA: "talita",
} as const;

export type ProductType = (typeof ProductType)[keyof typeof ProductType];
