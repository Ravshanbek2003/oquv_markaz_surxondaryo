import { Card, Typography } from "@mui/material";

import { Props } from "./types";

export const DashboardCard = ({ icon, title, value, onClick }: Props) => (
  <Card
    onClick={onClick}
    sx={{
      p: {
        xs: 0.5,
        sm: 0.5,
        md: 1,
        lg: 2,
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderRadius: "10px",
      border: "1px solid #ccc",
      boxShadow: "none",
      bgcolor: "#ffffff",
      cursor: "pointer",
    }}
  >
    <div>{icon}</div>
    <Typography
      sx={{
        mt: {
          xs: 0.5,
          sm: 1,
        },
      }}
      color="text.secondary"
      align="center"
      variant="caption"
    >
      {title}
    </Typography>
    <Typography
      variant="h6"
      sx={{
        fontSize: {
          xs: "16px",
          sm: "20px",
        },
      }}
    >
      {value}
    </Typography>
  </Card>
);
