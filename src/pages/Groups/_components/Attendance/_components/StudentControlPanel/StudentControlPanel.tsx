import { useAddToGroupMutation } from "@/app/api";
import { useHandleRequest } from "@/hooks";
import { CircularProgress, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RiPlayCircleLine } from "react-icons/ri";
import { StudentControlPanelProps } from "./types";
import { useTranslation } from "react-i18next";

export const StudentControlPanel = ({
  student,
  groupId,
  groupStartDate,
  isAllowed,
}: StudentControlPanelProps) => {
  const { t } = useTranslation("", {
    keyPrefix: "groups.group.group_tabs.attendance.student_control_panel",
  });

  const [anchorElStudent, setAnchorElStudent] = useState<null | HTMLElement>(
    null
  );
  const [studentId, setStudentId] = useState<string>("");
  const [studentStatus, setStudentStatus] = useState<"FROZEN" | "ACTIVE">(
    "ACTIVE"
  );

  const handleRequest = useHandleRequest();

  const [addToGroup, { isLoading: addToGroupIsLoading }] =
    useAddToGroupMutation();
  const openStudent = Boolean(anchorElStudent);

  const handleCloseStudent = () => {
    setAnchorElStudent(null);
  };
  const handleClickStudent = (
    event: React.MouseEvent<HTMLElement | SVGElement>,
    status: string,
    studentId: string
  ) => {
    setAnchorElStudent(event.currentTarget as HTMLElement);
    setStudentStatus(status === "ACTIVE" ? "ACTIVE" : "FROZEN");
    setStudentId(studentId);
  };
  const changeStudent = async (status: string, student_id: string) => {
    await handleRequest({
      request: async () => {
        if (student_id && status) {
          const result = await addToGroup({
            studentId: student_id,
            body: {
              action: "set",
              group: groupId,
              startDate: groupStartDate,
              status: status,
            },
          }).unwrap();
          return result;
        }
      },
      onSuccess: () => {
        toast.success(
          status === "ACTIVE"
            ? `${t("toast.active")}`
            : status === "FROZEN"
            ? `${t("toast.frozen")}`
            : status === "LEFT"
            ? `${t("toast.left")}`
            : `${t("toast.unknown_status")}`
        );
      },
    });
  };
  
  return (
    <div>
      {student?.groups?.filter((el) => el.group?._id === groupId)[0].status !==
        "LEFT" && (
        <div className="flex justify-center items-center">
          {!addToGroupIsLoading ? (
            <button disabled={!isAllowed}>
              <BsThreeDotsVertical
                className="mx-auto cursor-pointer"
                onClick={(event) =>
                  handleClickStudent(
                    event,
                    student?.groups?.filter(
                      (el) => el.group?._id === groupId
                    )[0]?.status,
                    student?._id
                  )
                }
              />
            </button>
          ) : (
            <CircularProgress
              color={
                student?.groups?.filter((el) => el.group._id === groupId)[0]
                  .status === "LEFT"
                  ? "error"
                  : student?.groups?.filter((el) => el.group._id === groupId)[0]
                      .status === "FROZEN"
                  ? "info"
                  : "success"
              }
              size={"1rem"}
            />
          )}
        </div>
      )}
      {studentStatus === "FROZEN" && (
        <Menu
          anchorEl={anchorElStudent}
          id="account-menu"
          open={openStudent}
          onClose={handleCloseStudent}
          onClick={handleCloseStudent}
          sx={{ marginLeft: "-70px" }}
        >
          <MenuItem
            onClick={() => changeStudent("ACTIVE", studentId)}
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
              <RiPlayCircleLine size={18} />
            </span>
            {t("activate")}
          </MenuItem>
          <MenuItem
            onClick={() => changeStudent("LEFT", studentId)}
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
              <FiUserX size={18} />
            </span>
            {t("expel_from_group")}
          </MenuItem>
        </Menu>
      )}
      {studentStatus === "ACTIVE" && (
        <Menu
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          slotProps={{
            paper: {
              sx: {
                boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
              },
            },
          }}
          anchorEl={anchorElStudent}
          id="account-menu"
          open={openStudent}
          onClose={handleCloseStudent}
          onClick={handleCloseStudent}
          sx={{ marginLeft: "-70px" }}
        >
          <MenuItem
            onClick={() => changeStudent("FROZEN", studentId)}
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
              <RiDeleteBin5Line size={18} />
            </span>
            {t("freeze")}
          </MenuItem>

          <MenuItem
            onClick={() => changeStudent("LEFT", studentId)}
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
              <FiUserX size={18} />
            </span>
            {t("expel_from_group")}
          </MenuItem>
        </Menu>
      )}
    </div>
  );
};
