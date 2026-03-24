import React from "react";
import { Props } from "./types";
import { Button, Typography, Box } from "@mui/material";

export default class ErrorBoundary extends React.Component<Props> {
  public state = { error: false };

  public static getDerivedStateFromError() {
    return { error: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught error: ", error, errorInfo);
  }

  public render() {
    if (this.state.error) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 2,
          }}
        >
          <Typography
            color="primary"
            variant="h1"
            sx={{ fontSize: "3rem", fontWeight: "bold" }}
          >
            Unknown error occurred
          </Typography>
          <Box sx={{ mt: 3, mb: 6 }}>
            <Typography variant="h6">
              We're so sorry for unexpected issues
            </Typography>
            <Typography variant="h6">
              Please try to reload the page or come back later sometime
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.replace("/")}
            sx={{
              textTransform: "none",
              fontSize: "1.125rem",
              padding: "12px 24px",
              backgroundColor: "primary.main",
            }}
          >
            Reload page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
