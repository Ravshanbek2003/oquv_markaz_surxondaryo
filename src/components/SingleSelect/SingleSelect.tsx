import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const SingleSelect = ({
  label,
  onChange,
  options,
  error,
  helperText,
  sx,
  value,
  forNotification = false,
  size = "medium",
}: Props) => {
  const { t } = useTranslation();
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    onChange?.(typeof value === "string" ? value.split(",") : value);
  };

  if (forNotification) {
    return (
      <FormControl sx={{ width: "100%", ...sx }}>
        <Select
          id="demo-multiple-checkbox"
          multiple
          displayEmpty
          value={value}
          onChange={handleChange}
          renderValue={(selected) => {
            if (selected?.length === 0) {
              return <p>{t("all")}</p>;
            }
            return selected
              .map(
                (value) => options.find((name) => name.value === value)?.label
              )
              .join(", ");
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          {options.length ? (
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={value?.includes(option.value)} />
                <ListItemText primary={option.label} />
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
  }

  return (
    <FormControl variant="outlined" error={error} sx={{ width: "100%", ...sx }}>
      {label && <InputLabel id={`${label}-label`}>{label}</InputLabel>}
      <Select
        labelId={`${label}-label`}
        id={`${label}-select`}
        label={label}
        onChange={onChange}
        value={value}
        size={size}
      >
        {options.length ? (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
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
