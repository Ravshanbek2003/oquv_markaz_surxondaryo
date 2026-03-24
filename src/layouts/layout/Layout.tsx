import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { Props } from "./types";
import { SideBar } from "../SideBar";
import { Header } from "../Header";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { PUBLIC_ROUTES } from "@/constants";

export const Layout = ({ children }: Props) => {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const isAuth = useMemo(
    () => !Object.values(PUBLIC_ROUTES).includes(pathname),
    [pathname]
  );
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenMenu(newOpen);
  };
  return (
    <Box>
      {isAuth && !matches && (
        <Drawer open={openMenu} onClose={toggleDrawer(false)}>
          <SideBar setOpenMenu={setOpenMenu} openMenu={openMenu} />
        </Drawer>
      )}
      {isAuth && matches && (
        <SideBar setOpenMenu={setOpenMenu} openMenu={openMenu} />
      )}
      {isAuth && <Header setOpenMenu={setOpenMenu} />}

      <Box
        sx={
          isAuth
            ? {
                paddingLeft: {
                  xs: "10px",
                  sm: "60px",
                  md: "200px",
                  lg: "270px",
                },
                paddingTop: {
                  xs: "70px",
                  sm: "100px",
                  md: "100px",
                  lg: "130px",
                },
                paddingRight: {
                  xs: "10px",
                  sm: "20px",
                  md: "20px",
                  lg: "30px",
                },
              }
            : {}
        }
      >
        {children}
      </Box>
    </Box>
  );
};
