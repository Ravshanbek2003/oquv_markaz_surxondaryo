import { SxProps } from "@mui/material";

export type MultipleSelectProps = {
  names: string[];
  label?: string;
  className?: string;
  onChange?: (value: string[]) => void;
  error?: boolean;
  sx?: SxProps;
};
