import { useGetAllCoursesQuery } from "@/app/api/courseApi";
import { Loader } from "@/components";
import { formatAmount } from "@/utils";
import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const Courses = () => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.office.courses_tabs",
  });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );

  const { data: { courses } = {}, isLoading } = useGetAllCoursesQuery({
    branchID: branch,
  });
  if (isLoading) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {courses && courses.length ? (
        courses?.map((course) => (
          <div
            key={course?._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={course?.image}
              alt={course?.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <Link
                to={`/courses/${course?._id}`}
                className="text-black-3 text-base-lg capitalize font-semibold leading-6 link hover:text-blue-500 transition-colors duration-300 ease-in-out"
              >
                {course?.title}
              </Link>
              <Typography variant="body1" className="text-gray-500">
                {course?.duration}{" "}
                {course?.duration > 1 ? t("months") : t("month")}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginTop: "20px",
                  boxShadow: "none",
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              >
                {formatAmount(course?.price)} {t("uzs")}
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-[30vh] w-[75vw]">
          <Typography variant="h6">{t("no_data")}</Typography>
        </div>
      )}
    </div>
  );
};
