import { SxProps } from "@mui/material";

interface Option {
  value: string;
  label: string;
}

export interface Props {
  label?: string;
  options: Option[];
  error?: boolean;
  helperText?: string;
  onChange?: (event: SelectChangeEvent) => void;
  sx?: SxProps;
  value?: string[];
  forNotification?: boolean;
  size?: "small" | "medium";
}
