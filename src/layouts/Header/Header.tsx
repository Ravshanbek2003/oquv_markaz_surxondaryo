/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useStorage } from "@/utils";
import { SingleSelect } from "@/components";
import { useGetAllBranchesQuery, useMeQuery } from "@/app/api";
import { useEffect, useState } from "react";
import { Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBranch } from "@/app/slices";
import Avatar from "@mui/material/Avatar";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { LangModal } from "./lang-modal";
import { useTranslation } from "react-i18next";
export const Header = ({
  setOpenMenu,
}: {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { branch } = useSelector((state: any) => state.branch);
  const { data: { branches } = {} } = useGetAllBranchesQuery({});
  const { data: user } = useMeQuery("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openLangModal, setOpenLangModal] = useState(false);
  const { t } = useTranslation("", { keyPrefix: "layout.header" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    setAnchorEl(null);
    navigate(path);
  };

  useEffect(() => {
    if (branches?.length && !branches.find((b) => b._id === branch)) {
      dispatch(setBranch(branches?.[0]._id));
    }
  }, [branch, branches]);

  const handleLogout = () => {
    useStorage.removeCredentials();
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        width: "100%",
        height: {
          xs: "60px",
          sm: "80px",
          md: "80px",
          lg: "100px",
        },
        borderBottom: "1px solid #ccc",
        pl: {
          xs: "0px",
          sm: "60px",
          md: "200px",
          lg: "290px",
        },
        pr: {
          xs: "10px",
          sm: "20px",
          md: "20px",
          lg: "50px",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        zIndex: 10,
      }}
    >
      <IconButton
        id="fade-button"
        aria-controls={"fade-menu"}
        aria-haspopup="true"
        aria-expanded={"true"}
        onClick={() => setOpenMenu(true)}
        sx={{
          width: "40px",
          height: "40px",
          display: {
            xs: "block",
            sm: "block",
            md: "none",
          },
        }}
      >
        <AiOutlineMenuUnfold />
      </IconButton>
      <SingleSelect
        options={
          branches?.map((branch) => ({
            value: branch._id,
            label: branch.title,
          })) || []
        }
        onChange={(value) => {
          dispatch(setBranch(value.target.value));
        }}
        value={branch}
        sx={{
          width: {
            xs: 160,
            sm: 200,
            md: 260,
            lg: 300,
          },
        }}
        size={matches ? "medium" : "small"}
      />
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            columnGap: 1,
            mr: 1,
          }}
        >
          <Typography
            sx={{
              textTransform: "capitalize",
              fontSize: {
                xs: "12px",
                sm: "16px",
              },
            }}
          >
            {user?.fullName}
          </Typography>
          <Typography
            color="text.secondary"
            variant="caption"
            sx={{
              fontSize: {
                xs: "10px",
                sm: "12px",
              },
            }}
          >
            {t(user?.role || "")}
          </Typography>
        </Box>

        <Box
          sx={{
            borderWidth: "2px",
            borderColor: "primary.main",
            borderStyle: "solid",
            borderRadius: "50%",
            marginLeft: {
              xs: "1px",
              sm: "9px",
            },
            padding: "2px",
          }}
        >
          <Avatar
            sx={{
              width: {
                xs: 30,
                sm: 50,
              },
              height: {
                xs: 30,
                sm: 50,
              },
              backgroundColor: "primary.main",
              textTransform: "capitalize",
            }}
            src={user?.avatar}
          >
            {user?.fullName.charAt(0)}
          </Avatar>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              minWidth: "160px",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleNavigate("/profile")}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          {t("profile_menu.profile")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenLangModal(true);
            handleClose();
          }}
        >
          <ListItemIcon>
            <Avatar
              sx={{ width: "23px !important", height: "23px !important" }}
              src={
                {
                  en: "/lang/eng.png",
                  ru: "/lang/rus.png",
                  uz: "/lang/uzb.png",
                }[localStorage.getItem("language") || "en"]
              }
            />
          </ListItemIcon>
          {t("profile_menu.language")}
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{ ":hover": { bgcolor: "#ffe8e8" } }}
        >
          <ListItemIcon>
            <Logout color="error" fontSize="small" />
          </ListItemIcon>
          <Typography color="error">{t("profile_menu.logout")}</Typography>
        </MenuItem>
      </Menu>
      <LangModal open={openLangModal} onClose={() => setOpenLangModal(false)} />
    </Box>
  );
};
