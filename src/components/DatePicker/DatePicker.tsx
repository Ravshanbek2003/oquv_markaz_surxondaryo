import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as UIDatePicker } from "@mui/x-date-pickers/DatePicker";
import { Props } from "./types";

export const DatePicker = ({
  label,
  value,
  onChange,
  helperText,
  error,
}: Props) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <UIDatePicker
      label={label}
      value={value}
      onChange={onChange}
      format="DD.MM.YYYY"
      sx={{ width: "100%" }}
      slotProps={{
        textField: {
          helperText,
          error,
        },
      }}
    />
  </LocalizationProvider>
);
