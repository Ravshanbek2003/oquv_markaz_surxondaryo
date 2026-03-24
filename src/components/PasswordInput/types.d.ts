export type Props = {
  label?: string;
  error?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  variant: "outlined" | "standard" | "filled";
  helperText?: string;
};
