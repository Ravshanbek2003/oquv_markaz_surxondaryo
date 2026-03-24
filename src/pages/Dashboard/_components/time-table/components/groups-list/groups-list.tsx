import { Link } from "react-router-dom";
import { Props } from "./types";
import { Box, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export const GroupsList = ({ groups }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "dashboard.group" });
  const theme = useTheme();
  if (!groups.length) {
    return (
      <div
        className="grid place-content-center text-sm font-medium"
        style={{ color: theme.palette.primary.main }}
      >
        {t("not_set")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {groups.map((group) => (
        <Link
          style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: theme.palette.primary.main,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.primary.main;
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "black";
          }}
          to={`/groups/${group._id}`}
          key={group._id}
          className={`duration-default rounded-md`}
        >
          <Box
            sx={{
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "100px",
            }}
          >
            <span className="text-sm font-semibold leading-5">
              {group.name}
            </span>
            <span className="text-xs">
              {group?.startTime !== undefined &&
              group?.course?.lessonDuration !== undefined ? (
                <>
                  {Math.floor(group.startTime / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(group.startTime % 60).toString().padStart(2, "0")} -{" "}
                  {Math.floor(
                    (group?.startTime + group?.course?.lessonDuration) / 60
                  )
                    .toString()
                    .padStart(2, "0")}
                  :
                  {((group?.startTime + group?.course?.lessonDuration) % 60)
                    .toString()
                    .padStart(2, "0")}
                </>
              ) : (
                t("time_not_available")
              )}
            </span>
          </Box>
        </Link>
      ))}
    </div>
  );
};
