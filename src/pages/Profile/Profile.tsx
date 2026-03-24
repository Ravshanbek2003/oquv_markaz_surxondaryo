import {
  Avatar,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { EditProfile } from "./_components";
import { useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { useMeQuery } from "@/app/api";
import { formatUzbekPhoneNumber } from "@/utils";
import { useTranslation } from "react-i18next";

export const ProfilePage = () => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation("", { keyPrefix: "profile" });

  const { data: user } = useMeQuery("");

  return (
    <div>
      <Card
        color="primary"
        component="h2"
        sx={{
          mb: 3,
          maxWidth: "400px",
          padding: "6px",
          borderRadius: "10px",
        }}
      >
        <CardContent
          sx={{
            bgcolor: "primary.main",
            borderRadius: "8px",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <Avatar
            sx={{
              width: "85px",
              height: "85px",
              marginTop: "90px",
              marginLeft: "5px",
              border: "3px solid white",
              fontSize: "50px",
              backgroundColor: "primary.main",
              textTransform: "uppercase",
            }}
            src={user?.avatar}
          >
            {user?.fullName.charAt(0)}
          </Avatar>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
          >
            <MdModeEdit color="white" fontSize={24} />
          </IconButton>
        </CardContent>
        <CardContent sx={{ marginBottom: "-40px" }}>
          <Typography
            color="primary"
            sx={{
              marginTop: "20px",
              fontWeight: "600",
              textTransform: "capitalize",
              fontSize: "20px",
            }}
          >
            {user?.fullName}
          </Typography>
          <div className="flex justify-between mt-2 mb-3 text-black">
            <Stack direction={"row"} columnGap={2}>
              <Chip
                size="small"
                color="primary"
                variant="filled"
                sx={{ borderRadius: "4px" }}
                label={user?.role}
              />
            </Stack>
          </div>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "-15px",
              marginTop: "-10px",
            }}
          >
            <div className="flex items-center justify-between w-full">
              <Typography variant="body2" color="textPrimary">
                {t("phone")}:
              </Typography>
              <Typography color="primary" sx={{ fontWeight: "500" }}>
                {formatUzbekPhoneNumber(user?.phoneNumber as string)}
              </Typography>
            </div>
            <div className="flex items-center justify-between w-full">
              <Typography variant="body2" color="textPrimary">
                {t("telegram_username")}:
              </Typography>
              <Typography color="primary" sx={{ fontWeight: "500" }}>
                {user?.telegram
                  ? user?.telegram?.startsWith("@")
                    ? user?.telegram
                    : `@${user?.telegram}`
                  : "No set"}
              </Typography>
            </div>
            <div className="flex items-center justify-between w-full">
              <Typography variant="body2" color="textPrimary">
                {t("balance")}:
              </Typography>
              <Typography color="primary" sx={{ fontWeight: "500" }}>
                {user?.balance} {t("uzs")}
              </Typography>
            </div>
            {user?.percent && (
              <div className="flex items-center justify-between w-full">
                <Typography variant="body2" color="textPrimary">
                  {t("percent")}:
                </Typography>
                <Typography color="primary" sx={{ fontWeight: "500" }}>
                  {user?.percent} %
                </Typography>
              </div>
            )}
          </CardContent>
        </CardContent>
      </Card>
      <EditProfile open={open} onClose={() => setOpen(false)} />
    </div>
  );
};
