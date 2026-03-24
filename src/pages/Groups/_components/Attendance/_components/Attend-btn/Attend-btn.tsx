import {
  useDeleteAttendanceMutation,
  useSetAttendanceMutation,
} from "@/app/api/attendanceApi";
import { useHandleRequest } from "@/hooks";
import {
  Box,
  Button,
  CircularProgress,
  Popover,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { AttendBtnProps } from "./types";
import { IoClose } from "react-icons/io5";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
export const AttendBtn = ({
  date,
  attend,
  cancelled,
  studentId,
  groupId,
  studentStatus,
  isAllowed,
}: AttendBtnProps) => {
  const { t } = useTranslation("", { keyPrefix: "groups.group.attend_btn" });
  const today = new Date();
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
  // const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState({
    date: "",
    studentId: "",
  });
  const options = [
    { label: "absent", color: "#B7140A" },
    { label: "present", color: "#0AB711" },
    { label: "reason", color: "#E5A506" },
  ];

  const [deleteAttendance, { isLoading }] = useDeleteAttendanceMutation();

  const [setAttendance, { isLoading: isSetting }] = useSetAttendanceMutation();

  const handleRequest = useHandleRequest();
  const handleDeleteAttendance = async (id: string) => {
    await handleRequest({
      request: async () => {
        if (id) {
          const result = await deleteAttendance({ id }).unwrap();
          return result;
        }
      },
      onSuccess: () => {
        // setSelectedLabel("");
        toast.success(`${t("toast.title_1")}`);
      },
    });
  };
  const handleOptionClick = (option: { label: string; color: string }) => {
    // setSelectedLabel(option.label);
    setPopoverAnchor(null);
    handleRequest({
      request: async () => {
        if (selectedAttendance.date && selectedAttendance.studentId) {
          const result = await setAttendance({
            student: selectedAttendance.studentId,
            group: groupId,
            date: selectedAttendance.date,
            status: option.label.toLocaleUpperCase(),
          }).unwrap();
          return result;
        }
      },
      onSuccess: () => {
        toast.success(`${t("toast.title_2")}`);
      },
    });
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLElement>,
    date: string,
    studentId: string
  ) => {
    setSelectedAttendance({ date, studentId });
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  return (
    <Box
      sx={{
        borderRadius: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "8px",
      }}
    >
      {cancelled?.status === "cancelled" ? (
        <Typography color="error">
          <IoClose size={20} />
        </Typography>
      ) : isLoading || isSetting ? (
        <CircularProgress size={18} />
      ) : attend?.status !== undefined ? (
        <Button
          disabled={!isAllowed}
          variant="outlined"
          sx={{
            height: "24px",
            fontSize: "12px",
            lineHeight: "8px",
            borderWidth: "1px",
            borderColor: "transparent",
            textTransform: "none",
            backgroundColor:
              attend?.status === "PRESENT"
                ? "#0AB711"
                : attend?.status === "REASON"
                ? "#E5A506"
                : attend?.status === "ABSENT"
                ? "#B7140A"
                : "",
            color: "white",
            position: "relative",
            padding: "12px 16px",
          }}
        >
          {attend?.status ? t(attend.status.toLowerCase()) : ""}
          {studentStatus !== "FROZEN" && studentStatus !== "LEFT" && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                width: "12px",
                height: "12px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                fontSize: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAttendance(attend._id);
              }}
            >
              <IoClose />
            </span>
          )}
        </Button>
      ) : (
        <>
          <Button
            variant="outlined"
            disabled={
              (today < date ||
              studentStatus === "FROZEN" ||
              studentStatus === "LEFT"
                ? true
                : false) || !isAllowed
            }
            sx={{
              boxShadow: today.getDate() == Number(date.getDate()) ? 2 : 0,
              height: "24px",
              fontSize: "10px",
              borderWidth: "1px",
              borderColor: "primary.main",
              textTransform: "none",
              backgroundColor: "white",
              color: "black",
              padding: "12px 16px",
            }}
            onClick={(event) =>
              handleButtonClick(
                event,
                dayjs(date).format("YYYY-MM-DD"),
                studentId
              )
            }
          />

          <Popover
            slotProps={{
              paper: {
                sx: {
                  boxShadow: "none",
                },
              },
            }}
            open={Boolean(popoverAnchor)}
            anchorEl={popoverAnchor}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
            transitionDuration={{ enter: 5, exit: 10 }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "8px",
                padding: "1px",
                display: "flex",
              },
            }}
          >
            {options.map((option, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={() => {
                  handleOptionClick(option);
                }}
                sx={{
                  backgroundColor: option.color,
                  color: "white",
                  textTransform: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "5px",
                  margin: "2px",
                  "&:hover": {
                    backgroundColor: option.color,
                    filter: "brightness(0.9)",
                  },
                }}
              >
                {t(option.label)}
              </Button>
            ))}
          </Popover>
        </>
      )}
    </Box>
  );
};
