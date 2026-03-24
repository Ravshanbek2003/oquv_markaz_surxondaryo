import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { SxProps, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Option {
  label: string;
  value: string;
}

interface MultipleSelectProps {
  names: Option[];
  label: string;
  className?: string;
  onChange?: (value: string[]) => void;
  error?: boolean;
  sx?: SxProps;
  helperText?: string;
  value?: string[];
}

export const MultipleSelect = ({
  names,
  label,
  onChange,
  error,
  sx,
  helperText,
  value = [],
}: MultipleSelectProps) => {
  const { t } = useTranslation();
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    onChange?.(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl
      sx={{
        width: "100%",
        borderRadius: "4px",
        backgroundColor: "white",
        ...sx,
      }}
    >
      <InputLabel error={error}>{label}</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        inputProps={{
          sx: {
            padding: {
              xs: "10px 12px 16px 12px",
              md: "12px 14px 16px 14px",
            },
          },
        }}
        renderValue={(selected) =>
          selected
            ?.map(
              (value) => names.find((name) => name.value === value)?.label || ""
            )
            .join(",")
        }
        MenuProps={MenuProps}
        error={error}
      >
        {names.length ? (
          names?.map((name) => (
            <MenuItem key={name.value} value={name.value}>
              <Checkbox checked={value?.includes(name.value)} />
              <ListItemText primary={name.label} />
            </MenuItem>
          ))
        ) : (
          <MenuItem sx={{ display: "flex", justifyContent: "center" }}>
            {t("no_options")}
          </MenuItem>
        )}
      </Select>
      {error && (
        <Typography
          color="error"
          variant="body2"
          sx={{ mt: "3px", fontSize: 12, ml: "14px" }}
        >
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};
