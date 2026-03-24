import { LoginForm } from "@/components";
import { Box } from "@mui/material";

export const Login = () => {
  return (
    <Box
      component="section"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoginForm />
    </Box>
  );
};
