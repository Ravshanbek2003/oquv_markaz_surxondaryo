/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dayjs } from "dayjs";

export type Props = {
  label: string;
  value?: Dayjs;
  onChange?: (value: any) => void;
  helperText?: string;
  error?: boolean;
};
