import { Box, CircularProgress } from "@mui/material";
import { Props } from "./types";

export const Loader = ({ sx }: Props) => (
  <Box
    sx={{
      height: "100vh",
      width: "100%",
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "25px",
      ...sx,
    }}
  >
    <CircularProgress color="primary" size="2rem" />
  </Box>
);
