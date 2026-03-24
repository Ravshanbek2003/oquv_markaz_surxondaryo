import { MultipleSelect } from "@/components/MultipleSelect";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { GrPowerReset } from "react-icons/gr";
import { GoPlus } from "react-icons/go";
import { AddModal } from "./_components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllRoomsQuery,
  useGetAllStaffsQuery,
  useLazyGetAllGroupsQuery,
} from "@/app/api";
import { useSelector } from "react-redux";
import { DAYS_3LETTER, Role } from "@/constants";
import { Loader } from "@/components";
import { useGetAllCoursesQuery } from "@/app/api/courseApi";
import { useTranslation } from "react-i18next";

export const Groups = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<{
    courses: string[];
    rooms: string[];
    teachers: string[];
  }>({ courses: [], rooms: [], teachers: [] });

  const { t } = useTranslation("", { keyPrefix: "groups" });

  const navigate = useNavigate();
  const BRANCH = useSelector(
    (state: { branch: { branch: string } }) => state.branch.branch
  );

  const { data: { courses } = {} } = useGetAllCoursesQuery({
    branchID: BRANCH,
  });
  const { data: { rooms } = {} } = useGetAllRoomsQuery({
    branchID: BRANCH,
  });
  const { data: { staff } = {} } = useGetAllStaffsQuery({
    branchId: BRANCH,
    role: Role.TEACHER,
  });

  const [getAllGroups, { data: { groups = [] } = {}, isLoading, isFetching }] =
    useLazyGetAllGroupsQuery();

  const handleFilter = (
    key: "courses" | "rooms" | "teachers",
    value: string[]
  ) => {
    setFilters((prev) => {
      return { ...prev, [key]: value };
    });
  };

  useEffect(() => {
    if (BRANCH && getAllGroups) {
      getAllGroups({
        branch: BRANCH,
        room: filters?.rooms?.join(","),
        course: filters.courses.join(","),
        teacher: filters?.teachers?.join(","),
      });
    }
  }, [
    BRANCH,
    filters?.courses,
    filters?.rooms,
    filters?.teachers,
    getAllGroups,
  ]);

  if (isLoading) {
    return <Loader sx={{ height: "70vh", backgroundColor: "transparent" }} />;
  }
  return (
    <div className="pb-10">
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column-reverse",
            sm: "row",
          },
          pb: {
            xs: 1,
            sm: 2,
            md: 3,
            xl: 4,
          },
          gap: {
            xs: "8px",
            sm: "4px",
            xl: "12px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "column",
              md: "row",
            },
            gap: {
              xs: "8px",
              sm: "4px",
              xl: "12px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: {
                xs: "4px",
                xl: "12px",
              },
            }}
          >
            <MultipleSelect
              sx={{
                width: {
                  xs: "100%",
                  sm: "150px",
                  md: "130px",
                  xl: "150px",
                },
              }}
              value={filters?.rooms}
              names={
                rooms?.map((el) => ({ label: el.title, value: el._id })) || []
              }
              label={t("rooms")}
              onChange={(value) => handleFilter("rooms", value)}
            />
            <MultipleSelect
              sx={{
                width: {
                  xs: "100%",
                  sm: "150px",
                  md: "130px",
                  xl: "150px",
                },
              }}
              value={filters?.teachers}
              names={
                staff?.map((el) => ({ label: el?.fullName, value: el?._id })) ||
                []
              }
              label={t("teachers")}
              onChange={(value) => handleFilter("teachers", value)}
            />
          </Box>
          <Box
            sx={{
              // backgroundColor: "red",
              width: {
                xs: "100%",
                sm: "306px",
                md: "auto",
              },
              display: "flex",
              alignItems: "center",
              gap: {
                xs: "4px",
                xl: "12px",
              },
            }}
          >
            <MultipleSelect
              sx={{
                width: {
                  xs: "50%",
                  sm: "150px",
                  md: "130px",
                  xl: "150px",
                },
              }}
              value={filters.courses}
              names={
                courses?.map((el) => {
                  return { label: el.title, value: el._id };
                }) || []
              }
              label={t("courses")}
              onChange={(value) => handleFilter("courses", value)}
            />
            <Button
              startIcon={<GrPowerReset />}
              variant="contained"
              color="inherit"
              sx={{
                width: {
                  xs: "50%",
                  sm: "49%",
                  md: "auto",
                },
                boxShadow: "none",
                textTransform: "none",
                bgcolor: "white",
                border: "none",
                height: "48px",
                whiteSpace: "nowrap",
                padding: {
                  xs: "4px 24px",
                  sm: "10px 24px",
                  md: "11px 6px",
                  lg: "11px 24px",
                },
              }}
              disabled={
                !filters.courses.length &&
                !filters?.teachers?.length &&
                !filters?.rooms?.length
              }
              onClick={() =>
                setFilters({ courses: [], rooms: [], teachers: [] })
              }
            >
              {t("reset_filters")}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button
            startIcon={<GoPlus />}
            variant="contained"
            color="primary"
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              boxShadow: "none",
              textTransform: "none",
              padding: {
                xs: "4px 24px",
                sm: "10px 24px",
                md: "11px 24px",

                lg: "11px 20px",
                xl: "11px 24px",
              },
              whiteSpace: "nowrap",
            }}
            onClick={() => setOpen(true)}
          >
            {t("add_button")}
          </Button>
        </Box>
      </Box>
      {isFetching ? (
        <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />
      ) : (
        <TableContainer sx={{ borderRadius: "8px", border: "1px solid #ccc" }}>
          <Table
            sx={{ minWidth: 650, bgcolor: "#fff" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                  align="justify"
                >
                  #
                </TableCell>
                <TableCell
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                  align="justify"
                >
                  {t("table.group_name")}
                </TableCell>
                <TableCell
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                  align="justify"
                >
                  {t("table.course")}
                </TableCell>
                <TableCell
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                  align="justify"
                >
                  {t("table.teacher")}
                </TableCell>
                <TableCell
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                  align="justify"
                >
                  {t("table.days")}
                </TableCell>
                <TableCell
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                  align="justify"
                >
                  {t("table.room")}
                </TableCell>
                <TableCell
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                  align="center"
                >
                  {t("table.students")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups && groups.length ? (
                groups?.map((group, index) => (
                  <TableRow
                    key={group._id}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell
                      onClick={() => navigate(`/groups/${group?._id}`)}
                      align="justify"
                      sx={{
                        textTransform: "capitalize",
                        cursor: "pointer",
                        ":hover": { color: "primary.main" },
                      }}
                    >
                      {group?.name}
                    </TableCell>
                    <TableCell
                      align="justify"
                      sx={{ color: group?.course?.title ? "black" : "red" }}
                    >
                      {group?.course?.title || t("deleted_course")}
                    </TableCell>
                    <TableCell
                      align="justify"
                      sx={{ color: group?.teacher?.fullName ? "black" : "red" }}
                    >
                      {group?.teacher?.fullName || t("deleted_teacher")}
                    </TableCell>

                    <TableCell align="justify">
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "14px", minWidth: "80px" }}
                      >
                        {Math.floor(group?.startTime / 60)
                          .toString()
                          .padStart(2, "0")}
                        :{(group?.startTime % 60).toString().padStart(2, "0")} -
                        {Math.floor(
                          (group?.startTime + group?.course?.lessonDuration) /
                            60
                        )
                          .toString()
                          .padStart(2, "0")}
                        :
                        {(
                          (group?.startTime + group?.course?.lessonDuration) %
                          60
                        )
                          .toString()
                          .padStart(2, "0")}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: "10px" }}>
                        {group?.days
                          ?.map((el) => DAYS_3LETTER[el % 7])
                          .join(", ")}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="justify"
                      sx={{ color: group?.room?.title ? "black" : "red" }}
                    >
                      {group?.room?.title || "No data"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: group?.students ? "black" : "red" }}
                    >
                      {group?.students || t("table.no_data_available")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t("table.no_data_available")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <AddModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};
