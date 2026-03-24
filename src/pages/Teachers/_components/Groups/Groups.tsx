import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box, Divider } from "@mui/material";
import { DAYS_3LETTER } from "@/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllGroupsQuery } from "@/app/api";
import { useSelector } from "react-redux";
import { Loader } from "@/components";
import { useTranslation } from "react-i18next";

export const Groups = () => {
  const { t } = useTranslation("", { keyPrefix: "teachers.tabs.groups" });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const { teacherId } = useSelector(
    (state: { teacher: { teacherId: string } }) => state.teacher
  );
  const { pathname } = useLocation();

  const { data: { groups } = {}, isLoading: isGettingGroups } =
    useGetAllGroupsQuery({
      branch,
      teacher: teacherId || pathname.split("/")[2],
    });

  const navigate = useNavigate();

  if (isGettingGroups) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
  }

  return (
    <>
      {groups && groups.length ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: {
              xs: 1,
              sm: 1,
              md: 1,
              lg: 2,
            },
          }}
        >
          {groups?.map((group) => (
            <Card
              key={group._id}
              sx={{
                width: {
                  xs: "100%",
                  sm: "380px",
                  md: "400px",
                  lg: "450px",
                },
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <div>
                    <div className="flex justify-between mt-2 text-black">
                      <span className="text-[16px]">{group.name}</span>
                      <Typography
                        sx={{ fontSize: "14px", color: "primary.main" }}
                      >
                        {t("group_name")}
                      </Typography>
                    </div>
                    <div className="flex justify-between mt-2 text-black">
                      <span className="text-[20px] font-medium">
                        {group?.course?.title || "No data"}
                      </span>
                      <Typography
                        sx={{ fontSize: "14px", color: "primary.main" }}
                      >
                        {t("course")}
                      </Typography>
                    </div>
                    <div className="flex justify-between mt-2 text-black">
                      <span>
                        {new Date(group?.startDate || "").toLocaleDateString(
                          "ru-RU"
                        )}
                      </span>
                      <Typography
                        sx={{ fontSize: "14px", color: "primary.main" }}
                      >
                        {t("start_date")}
                      </Typography>
                    </div>
                    <div className="flex justify-between mt-2 text-black">
                      <span>
                        {new Date(group?.endDate || "").toLocaleDateString(
                          "ru-RU"
                        )}
                      </span>
                      <Typography
                        sx={{ fontSize: "14px", color: "primary.main" }}
                      >
                        {t("end_date")}
                      </Typography>
                    </div>
                  </div>
                </Typography>
                <Divider sx={{ my: 2 }} />
                <div className="flex justify-between items-center mt-2 text-black">
                  <div>
                    <span>
                      {Math.floor(group?.startTime / 60)
                        .toString()
                        .padStart(2, "0")}
                      :{(group?.startTime % 60).toString().padStart(2, "0")} -{" "}
                      {Math.floor(
                        (group?.startTime + group?.course?.lessonDuration) / 60
                      )
                        .toString()
                        .padStart(2, "0")}
                      :
                      {((group?.startTime + group?.course?.lessonDuration) % 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "12px",
                          sm: "12px",
                          md: "14px",
                          lg: "16px",
                        },
                        color: "primary.main",
                      }}
                    >
                      {group.days.map((el) => DAYS_3LETTER[el % 7]).join(", ")}
                    </Typography>
                  </div>
                  <Button
                    id="basic-button"
                    color="primary"
                    sx={{
                      width: "120px",
                      height: "45px",
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      textTransform: "capitalize",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                    onClick={() => navigate(`/groups/${group._id}`)}
                  >
                    {t("see_group")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <div className="flex items-center justify-center w-full h-[40vh]">
          <Typography variant="h5" sx={{ color: "primary.main" }}>
            {t("no_groups_available")}
          </Typography>
        </div>
      )}
    </>
  );
};
