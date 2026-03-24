import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { LuMessageCircle } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { GroupTabs } from "../Groups/_components/GroupTabs";
import { MdModeEdit } from "react-icons/md";

import { MdOutlineArchive } from "react-icons/md";
import { useGetGroupQuery, useUpdateGroupMutation } from "@/app/api";
import { DAYS_3LETTER, Status } from "@/constants";
import dayjs from "dayjs";
import { Loader } from "@/components";
import { AddModal } from "../Groups/_components/add-modal";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { AddStudent } from "../Groups/_components/add-student";
import { formatAmount } from "@/utils";
import { GetGroupResponse } from "@/app/api/groupApi/types";
import { useTranslation } from "react-i18next";

export const Group = () => {
  const { t } = useTranslation("", { keyPrefix: "groups.group" });
  const { id } = useParams();
  const {
    data: group,
    isLoading: isGettingGroup,
    isError,
  } = useGetGroupQuery({ id: id as string });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState(false);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [addStudent, setAddStudent] = useState(false);
  const [archiveGroup, { isLoading: isDeleting }] = useUpdateGroupMutation();
  const navigate = useNavigate();
  const handleRequest = useHandleRequest();

  const handleDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await archiveGroup({
          id,
          body: { status: Status.INACTIVE },
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        toast.success(`${t("toast")}`);
        navigate(`/groups`);
      },
    });
  };

  if (isGettingGroup) {
    return <Loader sx={{ height: "70vh", backgroundColor: "transparent" }} />;
  }
  if (isError) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 2,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: "3rem", fontWeight: "bold" }}>
          {t("reload.unknown_error_occurred")}
        </Typography>
        <Box sx={{ mt: 3, mb: 6 }}>
          <Typography variant="h6">{t("reload.issues")}</Typography>
          <Typography variant="h6">{t("reload.sometime")}</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.replace("/")}
          sx={{
            textTransform: "none",
            fontSize: "1.125rem",
            padding: "12px 24px",
          }}
        >
          {t("reload.reload_page")}
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Card
        sx={{
          width: {
            xs: "100%",
            sm: "450px",
            md: "522px",
          },
          borderRadius: "20px",
          padding: {
            xs: "6px",
            sm: "10px",
            md: "20px",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "5px",
            marginBottom: "20px",
          }}
        >
          <Box
            sx={{
              width: "85px",
              height: "85px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "primary.main",
              color: "white",
              border: "2px solid white",
              outline: "2px solid",
              outlineColor: "primary.main",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                margin: "10px",
                textTransform: "uppercase",
              }}
            >
              {group?.name.charAt(0)}
            </Typography>
          </Box>

          <IconButton
            id="fade-button"
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{
              width: "40px",
              height: "40px",
              position: "relative",
              right: "-10px",
              top: "-15px",
            }}
          >
            <BsThreeDotsVertical fontSize={24} />
          </IconButton>
        </CardContent>
        <Box>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "-30px",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              {group?.name}
            </Typography>
            <Typography color="primary" variant="body1">
              {t("groups_name")}
            </Typography>
          </CardContent>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "-22px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: group?.course?.title ? "black" : "red" }}
            >
              {group?.course?.title || t("deleted_course")}
            </Typography>
            <Typography color="primary" variant="body1">
              {t("course")}
            </Typography>
          </CardContent>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "-22px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: group?.teacher?.fullName ? "black" : "red" }}
            >
              {group?.teacher?.fullName || t("deleted_teacher")}
            </Typography>
            <Typography color="primary" variant="body1">
              {t("teacher_name")}
            </Typography>
          </CardContent>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "-22px",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "semibold" }}>
              {dayjs(group?.startDate).format("DD.MM.YYYY")} vs{" "}
              {dayjs(group?.endDate).format("DD.MM.YYYY")}
            </Typography>
            <Typography color="primary" variant="body1">
              {t("training_dates")}
            </Typography>
          </CardContent>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "-22px",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                size="small"
                color="primary"
                variant="filled"
                sx={{ borderRadius: "4px" }}
                label={`${group?.students} students`}
              />
              <Chip
                size="small"
                color={group?.room?.title ? "primary" : "error"}
                variant="filled"
                sx={{ borderRadius: "4px" }}
                label={
                  group?.room?.title ? group?.room?.title : t("deleted_room")
                }
              />
            </Box>

            <Typography color="primary" variant="body1">
              {t("students_room")}
            </Typography>
          </CardContent>
          <Divider sx={{ my: 1 }} />
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                display: "flex",
                flexDirection: "column",
              }}
              variant="body1"
            >
              {group?.days?.length
                ? group.days.map((el) => DAYS_3LETTER[el % 7]).join(", ")
                : `${t("no_days_available")}`}
              <br />
              {group?.startTime !== undefined &&
              group?.course?.lessonDuration !== undefined ? (
                <>
                  {Math.floor(group?.startTime / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(group?.startTime % 60)?.toString().padStart(2, "0")} -{" "}
                  {Math.floor(
                    (group?.startTime + group?.course?.lessonDuration) / 60
                  )
                    .toString()
                    .padStart(2, "0")}
                  :
                  {((group?.startTime + group?.course?.lessonDuration) % 60)
                    ?.toString()
                    .padStart(2, "0")}
                </>
              ) : (
                `${t("time_not_available")}`
              )}
            </Typography>
            <Button
              sx={{
                padding: "13px 31px",
                fontSize: "14px",
                bgcolor: "primary.main",
                color: "#fff",
              }}
            >
              {formatAmount(Number(group?.course?.price) || 0)} UZS
            </Button>
          </CardContent>
        </Box>

        <Menu
          id="fade-menu"
          MenuListProps={{ "aria-labelledby": "fade-button" }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: "orange",
            }}
            onClick={() => {
              handleClose();
              setOpenModal(true);
            }}
          >
            <MdModeEdit size={18} />
            {t("menu.edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: "green",
            }}
          >
            <LuMessageCircle size={18} />
            {t("menu.sms")}
          </MenuItem>
          <MenuItem
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: "gray",
            }}
            onClick={() => {
              handleClose();
              handleDelete(id as string);
            }}
          >
            {isDeleting ? (
              <CircularProgress sx={{ color: "gray" }} size={"1rem"} />
            ) : (
              <MdOutlineArchive size={20} />
            )}
            {t("menu.archive")}
          </MenuItem>
          <MenuItem
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
            onClick={() => {
              handleClose();
              setAddStudent(true);
            }}
          >
            <IoIosAdd size={20} />
            {t("menu.add_student")}
          </MenuItem>
        </Menu>
      </Card>
      <div className="mt-[70px]">
        {group && <GroupTabs group={group as unknown as GetGroupResponse} />}
      </div>
      <AddModal
        groupId={id}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
      <AddStudent
        groupId={id as string}
        open={addStudent}
        onClose={() => setAddStudent(false)}
      />
    </>
  );
};
