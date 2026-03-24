import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { HiChevronDown } from "react-icons/hi2";
import { useState } from "react";
import {
  Role,
  SETTINGS_LINKS as SETTINGS_LINK,
  SIDE_BAR_LINKS,
} from "@/constants";
import { useGetSettingsQuery, useMeQuery } from "@/app/api";
import { useSelector } from "react-redux";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { useTranslation } from "react-i18next";

export const SideBar = ({
  setOpenMenu,
  openMenu,
}: {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  openMenu: boolean;
}) => {
  const { t } = useTranslation("", { keyPrefix: "layout.sidebar" });
  const { pathname } = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { data: settings } = useGetSettingsQuery("");
  const { data: user } = useMeQuery("");
  const branch = useSelector(
    (state: { branch?: { branch?: string } }) => state?.branch?.branch,
  );

  const SIDE_BAR = SIDE_BAR_LINKS();
  const SETTINGS_LINKS = SETTINGS_LINK();

  return (
    <Box
      sx={{
        width: {
          xs: openMenu ? 180 : 0,
          sm: openMenu ? 180 : 44,
          md: 180,
          lg: 240,
        },
        transitionDuration: "0.2s",
        overflowX: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: "background.default",
        height: "100vh",
        borderRight: "1px solid #ccc",
        color: "text.secondary",
        overflowY: "auto",
        zIndex: 12,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            padding: {
              xs: 1,
              sm: 1,
              md: 1,
              lg: 2,
            },
            paddingLeft: {
              md: 1,
              sm: 1,
              xs: 0,
            },
          }}
        >
          <IconButton
            id="fade-button"
            aria-controls={"fade-menu"}
            aria-haspopup="true"
            aria-expanded={"true"}
            onClick={() => setOpenMenu(false)}
            sx={{
              position: "absolute",
              right: "0px",
              top: "20px",
              width: "40px",
              height: "40px",
              display: {
                xs: openMenu ? "block" : "none",
                sm: openMenu ? "block" : "none",
                md: "none",
              },
            }}
          >
            <AiOutlineMenuUnfold />
          </IconButton>
          <Link to={"/"}>
            <Box
              sx={{
                width: {
                  xs: 50,
                  sm: openMenu ? 60 : 30,
                  md: 80,
                  lg: 100,
                },
                height: {
                  xs: 50,
                  sm: openMenu ? 60 : 30,
                  md: 80,
                  lg: 100,
                },
              }}
            >
              <img
                alt="logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
                src={settings?.logo || "/placeholder.png"}
              />
            </Box>
          </Link>
          <Typography
            variant="h6"
            fontWeight={500}
            sx={{
              textAlign: "center",
              mt: 1,
              fontSize: {
                xs: "14px",
                sm: openMenu ? "16px" : "6px",
                md: "18px",
                lg: "20px",
              },
            }}
          >
            {settings?.name || "Loading..."}
          </Typography>
        </Box>
        <Box>
          <Divider sx={{ my: 1 }} />
          {SIDE_BAR.filter(
            (item) =>
              !item.permission ||
              user?.role === Role.CEO ||
              user?.permissions.find(
                (permission) =>
                  permission.name === item.permission &&
                  permission.branch === branch,
              ) ||
              (user?.role === Role.TEACHER && item.permission === "GROUPS"),
          ).map((item) => (
            <Link
              onClick={() => {
                setSettingsOpen(false);
              }}
              to={item.path}
              key={item.path}
              className="w-full relative"
            >
              <Button
                onClick={() => setOpenMenu(false)}
                sx={{
                  borderRadius: 0,
                  display: "flex",
                  justifyContent: "start",
                  gap: {
                    xs: "6px",
                    md: "6px",
                    lg: "12px",
                  },
                  paddingY: 1.5,
                  paddingLeft: {
                    xs: 2.5,
                    md: 2.5,
                    lg: 4,
                  },
                  textTransform: "none",
                  backgroundColor:
                    pathname.includes(item.path) && !settingsOpen
                      ? "primary.light"
                      : "",
                }}
                color={
                  pathname.includes(item.path) && !settingsOpen
                    ? "primary"
                    : "inherit"
                }
                fullWidth
                startIcon={item.icon}
                variant="text"
              >
                {item.label}
              </Button>
              <Box
                sx={{
                  width: 4,
                  height: {
                    xs: "60%",
                    sm: "60%",
                    md: "100%",
                  },
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  borderRadius: 4,
                  bgcolor:
                    pathname.includes(item.path) && !settingsOpen
                      ? "primary.main"
                      : "transparent",
                }}
                color={
                  pathname.includes(item.path) && !settingsOpen
                    ? "primary"
                    : "inherit"
                }
              ></Box>
            </Link>
          ))}
          <Divider sx={{ my: 1 }} />
          <Link
            onClick={() => setSettingsOpen(false)}
            to={"/notification"}
            className="w-full relative"
          >
            <Button
              onClick={() => setOpenMenu(false)}
              sx={{
                borderRadius: 0,
                display: "flex",
                justifyContent: "start",
                paddingY: 1.5,
                gap: {
                  xs: "6px",
                  md: "6px",
                  lg: "12px",
                },
                paddingLeft: {
                  xs: 2.5,
                  md: 2.5,
                  lg: 4,
                },
                textTransform: "none",
                backgroundColor:
                  pathname === "/notification" && !settingsOpen
                    ? "primary.light"
                    : "",
              }}
              color={
                pathname === "/notification" && !settingsOpen
                  ? "primary"
                  : "inherit"
              }
              fullWidth
              startIcon={<IoNotifications size={17} />}
              variant="text"
            >
              {t("notification")}
            </Button>
            <Box
              sx={{
                width: 5,
                height: "100%",
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                borderRadius: 4,
                bgcolor:
                  pathname === "/notification" && !settingsOpen
                    ? "primary.main"
                    : "transparent",
              }}
              color={
                pathname === "/notification" && !settingsOpen
                  ? "primary"
                  : "inherit"
              }
            ></Box>
          </Link>
          {user?.role === Role.CEO && (
            <Accordion
              onChange={(_, val2) => setSettingsOpen(val2)}
              expanded={settingsOpen}
              sx={{
                border: "none",
                marginTop: 0,
                boxShadow: "none",
                padding: 0,
                color: "text.secondary",
                pb: 3,
              }}
            >
              <AccordionSummary
                sx={{ padding: 0, margin: 0, maxHeight: "auto" }}
                id="panel-header"
                aria-controls="panel-content"
              >
                <Button
                  onClick={() => setOpenMenu(true)}
                  sx={{
                    borderRadius: 0,
                    justifyContent: "space-between",
                    paddingY: 1.5,
                    paddingLeft: {
                      xs: "18px",
                      sm: openMenu ? "18px" : "100px",
                      md: "18px",
                      lg: "29px",
                    },
                    textTransform: "none",
                  }}
                  color={settingsOpen ? "primary" : "inherit"}
                  fullWidth
                  variant="text"
                  className="w-full relative"
                  endIcon={
                    <HiChevronDown
                      size={15}
                      className={` transition-all duration-200 ${
                        settingsOpen ? "-rotate-180" : ""
                      }`}
                    />
                  }
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      ml: {
                        xs: 0,
                        sm: openMenu ? 0 : "15px",
                        md: 0,
                        lg: 0,
                      },
                      columnGap: {
                        xs: "12px",
                        md: "12px",
                        lg: "20px",
                      },
                    }}
                  >
                    <IoSettings size={17} /> {t("settings.settings")}
                  </Box>
                </Button>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  padding: 0,
                  margin: 0,
                  pl: {
                    xs: 5,
                    md: 5,
                    lg: 7,
                  },
                  pt: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  {SETTINGS_LINKS.map((item) => (
                    <Box
                      onClick={() => setOpenMenu(false)}
                      key={item.label}
                      sx={{
                        width: "80%",
                        p: 0.7,
                        borderRadius: "4px",
                        bgcolor: pathname.includes(item.path)
                          ? "#f7fafc"
                          : "inherit",
                        color: pathname.includes(item.path)
                          ? "primary.main"
                          : "inherit",
                        ":hover": { color: "primary.main" },
                      }}
                    >
                      <Link
                        className="w-full inline-block text-start"
                        key={item.path}
                        to={item.path}
                      >
                        {item.label}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          paddingY: "10px",
          marginTop: "auto",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          gap: 1,
          paddingLeft: {
            xs: 2.5,
            sm: openMenu ? 2.5 : "6px",
            md: 2.5,
            lg: 3.5,
          },
        }}
      >
        <Box></Box>
      </Box>
    </Box>
  );
};
