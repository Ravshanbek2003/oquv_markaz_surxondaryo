import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Props } from "./types";

export const PasswordInput = ({
  label,
  error,
  onChange,
  value,
  variant,
  helperText,
}: Props) => {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <FormControl variant={variant}>
      <InputLabel error={error} htmlFor="outlined-adornment-password">
        {label}
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? "hide the password" : "display the password"
              }
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
        error={error}
      />
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
