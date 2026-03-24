export type Props = {
  children: React.ReactNode;
  open: boolean;
  title?: string;
  onClose: () => void;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
};
