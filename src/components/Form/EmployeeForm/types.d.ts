export type Common = {
  label: string;
  value: string;
};

export type Sizes = "xs" | "sm" | "md" | "lg" | "xl";

export type Props = {
  onClose: () => void;
  setMaxWidth?: (value: Sizes) => void;
  selectedAdminId?: string;
};
