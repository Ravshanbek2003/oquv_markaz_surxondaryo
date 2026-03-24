import { SxProps } from "@mui/material";

interface Props {
  fullWidth?: boolean;
  onChange: (file: File) => void;
  value?: File | string | FormData | undefined;
  error?: boolean;
  helperText?: string;
  buttonSx?: SxProps;
  isShowImg?: boolean;
}
