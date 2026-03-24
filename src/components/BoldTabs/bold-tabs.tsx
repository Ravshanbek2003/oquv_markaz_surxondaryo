import { useEffect, useState } from "react";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { Props } from "./types";

export const BoldTabs = ({
  tabs,
  defaultTabIndex,
  contentClassName,
  tabClassName,
  tabButtonSx,
}: Props) => {
  const [activeTabIdx, setActiveTabIdx] = useState(defaultTabIndex || 0);
  const theme = useTheme();

  useEffect(() => {
    if (tabs?.length && defaultTabIndex !== undefined) {
      setActiveTabIdx(defaultTabIndex);
    }
  }, [tabs, defaultTabIndex]);

  if (!tabs?.length) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
          },
          gap: {
            xs: 1,
            sm: 1,
          },
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: {
              xs: "auto",
              md: "100%",
              lg: "auto",
            },
            overflowX: "auto",
            marginX: {
              xs: "auto",
              sm: 0,
            },
          }}
        >
          <Stack
            direction="row"
            sx={{
              border: "1px solid",
              borderColor: theme.palette.primary.main,
              borderRadius: "6px",
              overflow: "hidden",
            }}
            className={`flex w-max  ${tabClassName}`}
          >
            {tabs.map((tab, index) => (
              <Button
                key={index}
                onClick={() => setActiveTabIdx(index)}
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  lineHeight: "1.5rem",
                  padding: {
                    xs: "6px 10px",
                    sm: "10px 16px",
                  },
                  minWidth: {
                    xs: "100px",
                    sm: "130px",
                  },
                  color:
                    activeTabIdx === index
                      ? "white"
                      : theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  borderRight: tabs.length - 1 === index ? "none" : "1px solid",
                  borderRadius: "0px",
                  backgroundColor:
                    activeTabIdx === index
                      ? theme.palette.primary.main
                      : "white",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor:
                      activeTabIdx === index
                        ? theme.palette.primary.main
                        : "white",
                    boxShadow: "none",
                  },
                  ...tabButtonSx,
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        </Box>

        {tabs[activeTabIdx]?.leftSideContent && (
          <>{tabs[activeTabIdx].leftSideContent}</>
        )}
      </Box>
      {tabs[activeTabIdx]?.children && (
        <div className={`mt-7 ${contentClassName}`}>
          {tabs[activeTabIdx].children}
        </div>
      )}
    </div>
  );
};
