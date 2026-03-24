import {
  useDeleteCourseMutation,
  useLazyGetCourseQuery,
} from "@/app/api/courseApi";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddCourse } from "../Office/_components/Modals";

import toast from "react-hot-toast";
import { useHandleRequest } from "@/hooks";
import { MdModeEdit } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { formatAmount } from "@/utils";
import { useTranslation } from "react-i18next";
export const SingleCourse = () => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.office.courses_tabs.card",
  });
  const { id: courseId } = useParams();
  const [open, setOpen] = useState(false);
  const handleRequest = useHandleRequest();

  const navigate = useNavigate();
  const [getCourse, { data: course }] = useLazyGetCourseQuery();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const onDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await deleteCourse({ id }).unwrap();
        return result;
      },
      onSuccess: () => {
        toast.success(t("toast"));
        navigate(`/settings/office`);
      },
    });
  };
  useEffect(() => {
    if (courseId && getCourse) {
      getCourse({ id: courseId });
    }
  }, [courseId]);
  return (
    <div>
      {course ? (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            width: {
              xs: "100%",
              sm: "400px",
            },
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "6px",
            marginBottom: "10px",
          }}
        >
          <img
            src={course?.image}
            alt={"img"}
            className="w-full h-[207px] rounded-[16px] object-cover"
          />
          <div className="p-[10px]">
            <Typography
              variant="h2"
              sx={{
                fontSize: 20,
                fontWeight: "Bold",
                textTransform: "capitalize",
              }}
            >
              {course?.title}
            </Typography>
            <div className="flex justify-between items-center my-2">
              <Typography
                variant="body1"
                sx={{ fontSize: 16, fontWeight: 500 }}
              >
                {Math.floor(course?.lessonDuration / 60) +
                  (Math.floor(course?.lessonDuration / 60) > 1
                    ? t("hours")
                    : t("hour"))}
                {course?.lessonDuration % 60
                  ? (course?.lessonDuration % 60) + " minutes"
                  : null}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 12, fontWeight: 400 }}
              >
                {t("lesson_duration")}
              </Typography>
            </div>
            <div className="flex justify-between items-center">
              <Typography
                variant="body1"
                sx={{ fontSize: 16, fontWeight: 500 }}
              >
                {course?.duration} {t("month")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 12, fontWeight: 400 }}
              >
                {t("course_duration")}
              </Typography>
            </div>
            <Typography sx={{ fontSize: 16, fontWeight: 400, mt: 4 }}>
              {course?.description || "No description"}
            </Typography>

            <div className="flex items-center justify-between mt-[20px]">
              <Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "none",
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              >
                {formatAmount(course?.price)} UZS
              </Button>
              <div className="flex gap-[6px] items-center">
                <IconButton
                  onClick={() => setOpen(true)}
                  color="warning"
                  sx={{
                    padding: "4px",
                    width: "32px",
                    height: "32px",
                    border: "1px solid",
                    borderColor: "warning.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                  }}
                >
                  <MdModeEdit />
                </IconButton>

                <IconButton
                  onClick={() => onDelete(courseId || "")}
                  color="error"
                  sx={{
                    padding: "4px",
                    width: "32px",
                    height: "32px",
                    border: "1px solid",
                    borderColor: "error.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                  }}
                >
                  {isDeleting ? (
                    <CircularProgress sx={{ color: "red" }} size={"1rem"} />
                  ) : (
                    <IoMdTrash size={20} />
                  )}
                </IconButton>
              </div>
            </div>
          </div>
          <AddCourse
            courseId={courseId}
            open={open}
            onClose={() => setOpen(false)}
          />
        </Box>
      ) : (
        <>
          <Skeleton variant="rounded" width={400} height={207} />
          <br />
          <Skeleton variant="rounded" width={400} height={20} />
          <br />
          <Skeleton variant="rounded" width={400} height={20} />
          <br />
          <Skeleton variant="rounded" width={400} height={20} />
        </>
      )}
    </div>
  );
};
