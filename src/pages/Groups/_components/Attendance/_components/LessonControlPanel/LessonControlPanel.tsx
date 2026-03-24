import { MdOutlineCancel } from "react-icons/md";
import { TbArrowMoveRight } from "react-icons/tb";
import { MdOutlineRestartAlt } from "react-icons/md";
import { useState } from "react";
import { useHandleRequest } from "@/hooks";
import {
  useCancelLessonMutation,
  useMoveLessonMutation,
  useResetLessonMutation,
} from "@/app/api/lessonApi/lessonApi";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import toast from "react-hot-toast";
import {
  Button,
  CircularProgress,
  Dialog,
  Menu,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import { LessonControlPanelProps } from "./types";
export const LessonControlPanel = ({
  groupId,
  date,
  lessons,
  groupStartDate,
  isAllowed,
}: LessonControlPanelProps) => {
  const [isCancel, setIsCancel] = useState<"not_cancelled" | "cancelled">(
    "not_cancelled"
  );
  const [lessonDate, setLessonDate] = useState({
    date: "",
    newDate: "",
  });
  const [openCalendar, setOpenCalendar] = useState(false);
  const handleRequest = useHandleRequest();
  const [anchorElLesson, setAnchorElLesson] = useState<null | HTMLElement>(
    null
  );
  const openLesson = Boolean(anchorElLesson);

  const [cancelLesson, { isLoading: cancelIsLoading }] =
    useCancelLessonMutation();
  const [resetLesson, { isLoading: resetIsLoading }] = useResetLessonMutation();
  const [moveLesson, { isLoading: moveIsLoading }] = useMoveLessonMutation();
  const handleClickLesson = (
    event: React.MouseEvent<HTMLElement>,
    date: Date | { date: { status: string; date: Date } }
  ) => {
    setAnchorElLesson(event.currentTarget);

    const targetDate = date instanceof Date ? date : date.date.date;

    setIsCancel(
      lessons.some(
        (l) =>
          l?.status === "cancelled" &&
          l?.date === dayjs(targetDate).format("YYYY-MM-DD")
      )
        ? "cancelled"
        : "not_cancelled"
    );
    setLessonDate((prev) => ({
      ...prev,
      date: dayjs(targetDate).format("YYYY-MM-DD"),
    }));
  };
  const changeLesson = (
    date: { date: string; newDate: string },
    status: string
  ) => {
    if (status !== "move") {
      handleRequest({
        request: async () => {
          if (status === "cancel") {
            const result = await cancelLesson({
              group: groupId,
              date: date.date,
            }).unwrap();
            return result;
          }
          if (status === "reset") {
            const result = await resetLesson({
              group: groupId,
              date: date.date,
            }).unwrap();
            return result;
          }
        },

        onSuccess: () => {
          toast.success(
            status === "cancel"
              ? "The lesson was successfully canceled"
              : status === "reset"
              ? "The lesson was successfully restored"
              : "Unknown status"
          );
        },
      });
    } else {
      setOpenCalendar(true);
    }
  };
  const onMoveLesson = () => {
    handleRequest({
      request: async () => {
        const result = await moveLesson({
          group: groupId,
          date: lessonDate.date,
          newDate: lessonDate.newDate,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        toast.success("The lesson has been copied successfully");
      },
    });

    handleCloseCalendar();
  };
  const handleCloseLesson = () => {
    setAnchorElLesson(null);
  };
  const handleCloseCalendar = () => {
    setLessonDate((prev) => ({ ...prev, newDate: "" }));
    setOpenCalendar(false);
  };
  return (
    <div>
      <button
        disabled={!isAllowed}
        onClick={(event) => handleClickLesson(event, date)}
      >
        {cancelIsLoading || resetIsLoading || moveIsLoading ? (
          <CircularProgress sx={{ color: "primary.main" }} size={"1rem"} />
        ) : (
          dayjs(date).format("MMM D")
        )}
      </button>
      {isCancel === "cancelled" ? (
        <Menu
          slotProps={{
            paper: {
              sx: {
                boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
              },
            },
          }}
          anchorEl={anchorElLesson}
          id="account-menu1"
          open={openLesson}
          onClose={handleCloseLesson}
          onClick={handleCloseLesson}
          sx={{ marginLeft: "-70px" }}
        >
          <MenuItem
            onClick={() => changeLesson(lessonDate, "reset")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              lineHeight: "16px",
              color: "primary.main",
            }}
          >
            <span>
              <MdOutlineRestartAlt size={18} />
            </span>
            Restore lesson
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          slotProps={{
            paper: {
              sx: {
                boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
              },
            },
          }}
          anchorEl={anchorElLesson}
          id="account-menu1"
          open={openLesson}
          onClose={handleCloseLesson}
          onClick={handleCloseLesson}
          sx={{ marginLeft: "-70px" }}
        >
          <MenuItem
            onClick={() => changeLesson(lessonDate, "cancel")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              lineHeight: "16px",
              color: "primary.main",
            }}
          >
            <span className="ml-[1px]">
              <MdOutlineCancel size={18} />
            </span>
            Cancel lesson
          </MenuItem>
          <MenuItem
            onClick={() => changeLesson(lessonDate, "move")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              lineHeight: "16px",
              color: "primary.main",
            }}
          >
            <span className="ml-[1px]">
              <TbArrowMoveRight size={18} />
            </span>
            Move lesson
          </MenuItem>
        </Menu>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={openCalendar}
          onClose={handleCloseCalendar}
          maxWidth="sm"
          fullWidth
        >
          <div className="flex gap-2 p-4 items-center justify-between">
            <DatePicker
              label="Start Date"
              format="DD.MM.YYYY"
              value={dayjs(lessonDate.newDate)}
              minDate={dayjs(groupStartDate)}
              onChange={(newValue) => {
                setLessonDate((prev) => ({
                  ...prev,
                  newDate: newValue ? newValue.format("YYYY-MM-DD") : "",
                }));
              }}
            />
            <Button
              disabled={lessonDate.newDate === "" ? true : false}
              variant="contained"
              color="primary"
              onClick={() => {
                onMoveLesson();
              }}
            >
              Move
            </Button>
          </div>
        </Dialog>
      </LocalizationProvider>
    </div>
  );
};
