import { ThemesColor } from "@/constants";
import { createTheme } from "@mui/material/styles";

const blueTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3b82f6", light: "#eff6ff", contrastText: "#ffffff" },
    secondary: { main: "#9c27b0", contrastText: "#ffffff" },
    success: { main: "#4caf50", contrastText: "#ffffff" },
    warning: { main: "#ff9800", contrastText: "#000000" },
    info: { main: "#03a9f4", contrastText: "#ffffff" },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const redTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#d32f2f", light: "#fef2f2", contrastText: "#ffffff" },
    secondary: { main: "#ff4081", contrastText: "#ffffff" },
    success: { main: "#4caf50", contrastText: "#ffffff" },
    warning: { main: "#ff9800", contrastText: "#000000" },
    info: { main: "#03a9f4", contrastText: "#ffffff" },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const greenTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#388e3c", light: "#f0fdf4", contrastText: "#ffffff" },
    secondary: { main: "#8e24aa", contrastText: "#ffffff" },
    success: { main: "#4caf50", contrastText: "#ffffff" },
    warning: { main: "#ffeb3b", contrastText: "#000000" },
    info: { main: "#03a9f4", contrastText: "#ffffff" },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const orangeTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#f57c00", light: "#fff7ed", contrastText: "#ffffff" },
    secondary: { main: "#7b1fa2", contrastText: "#ffffff" },
    success: { main: "#388e3c", contrastText: "#ffffff" },
    warning: { main: "#ff9800", contrastText: "#000000" },
    info: { main: "#0288d1", contrastText: "#ffffff" },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const purpleTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#7b1fa2", light: "#f3e8ff", contrastText: "#ffffff" },
    secondary: { main: "#ff4081", contrastText: "#ffffff" },
    success: { main: "#388e3c", contrastText: "#ffffff" },
    warning: { main: "#fbc02d", contrastText: "#000000" },
    info: { main: "#03a9f4", contrastText: "#ffffff" },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export const themes = {
  [ThemesColor.BLUE]: blueTheme,
  [ThemesColor.RED]: redTheme,
  [ThemesColor.GREEN]: greenTheme,
  [ThemesColor.ORANGE]: orangeTheme,
  [ThemesColor.PURPLE]: purpleTheme,
};
