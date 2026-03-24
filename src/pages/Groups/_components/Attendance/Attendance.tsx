import { Loader } from "@/components";
import dayjs from "dayjs";
import { useLazyGetAllStudentsQuery, useMeQuery } from "@/app/api";
import { useLazyGetAllAttendanceQuery } from "@/app/api/attendanceApi";
import { GetGroupResponse } from "@/app/api/groupApi/types";
import { useGetLessonQuery } from "@/app/api/lessonApi/lessonApi";
import { AttendBtn } from "./_components/Attend-btn";
import { StudentControlPanel } from "./_components/StudentControlPanel";
import { Box, Button, Chip, Typography, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LessonControlPanel } from "./_components";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TbAdjustmentsHorizontal } from "react-icons/tb";

export const Attendance = ({ group }: { group: GetGroupResponse }) => {
  const { t } = useTranslation("", {
    keyPrefix: "groups.group.group_tabs.attendance",
  });
  const branch = useSelector(
    (state: { branch?: { branch?: string } }) => state?.branch?.branch
  );
  const [isAllowed, setIsAllowed] = useState(true);
  const [isShow, setIsShow] = useState(false);

  const today = new Date();
  const theme = useTheme();
  const { data: user } = useMeQuery("");
  useEffect(() => {
    const isAllowed =
      group?.teacher?._id === user?._id ||
      !!user?.permissions?.find(
        (item) => item.branch === branch && item.name === "ATTENDANCE"
      );
    setIsAllowed(isAllowed || user?.role === "CEO");
  }, [branch, user]);

  const [getAllAttendance, { data: { attendance } = {}, isLoading }] =
    useLazyGetAllAttendanceQuery();
  useEffect(() => {
    getAllAttendance({
      year: today.getFullYear().toString(),
      month: (today.getMonth() + 1).toString(),
      group: group?._id,
    });
  }, [group]);
  const { data: { lessons = [] } = {} } = useGetLessonQuery({
    id: group?._id,
  });

  const [
    getAllStudents,
    { data: { students } = {}, isLoading: isGettingAllStudents },
  ] = useLazyGetAllStudentsQuery();
  useEffect(() => {
    if (branch) {
      getAllStudents({
        branchId: group?.branch,
        groupId: group?._id,
        courseId: group?.course?._id,
        teacherId: group?.teacher?._id,
      });
    }
  }, [branch]);

  const handleLeftAndFrozenStudents = () => {
    setIsShow((prev) => !prev);
  };

  const [thisMonth, setThisMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const daysInMonth: Date[] = [];
    for (
      const day = new Date(thisMonth.year, thisMonth.month, 1);
      day < new Date(thisMonth.year, thisMonth.month + 1, 1);
      day.setDate(day.getDate() + 1)
    ) {
      const lesson = lessons.find(
        (l) =>
          l?.status === "moved" && l?.date === dayjs(day).format("YYYY-MM-DD")
      );
      if (group?.days && group?.days?.includes(day.getDay()) && !lesson)
        daysInMonth.push(new Date(day));
      else if (lesson) daysInMonth.push(new Date(lesson?.newDate as string));
    }

    setDays((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(daysInMonth)) {
        return prev;
      }
      return daysInMonth;
    });
  }, [lessons, group, thisMonth]);

  const getAttendanceChange = async (month: number, year: number) => {
    await getAllAttendance({
      year: year.toString(),
      month: month.toString(),
      group: group?._id,
    });
  };

  useEffect(() => {
    getAttendanceChange(thisMonth.month + 1, thisMonth.year);
  }, [thisMonth.month, thisMonth.year]);

  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (tableContainerRef.current) {
      const scrollLeft = tableContainerRef.current.scrollLeft;
      setIsScrolled(scrollLeft > 0);
    }
  };

  if (isGettingAllStudents || isLoading) {
    return <Loader sx={{ height: "40vh", backgroundColor: "transparent" }} />;
  }
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: {
            xs: "6px",
            sm: "10px",
          },
          backgroundColor: "white",
          borderRadius: "4px 4px 0px 0px ",
          padding: {
            xs: "6px",
            sm: "10px",
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={["DatePicker", "DatePicker", "DatePicker"]}
          >
            <DatePicker
              onChange={(e) =>
                e && setThisMonth({ month: e.month(), year: e.year() })
              }
              sx={{
                width: {
                  xs: "100%",
                  sm: "160px",
                },
              }}
              value={dayjs(new Date(thisMonth.year, thisMonth.month, 1))}
              maxDate={dayjs(today)}
              minDate={dayjs(group?.startDate)}
              label={t("month_and_year")}
              views={[`${"month"}`, `${"year"}`]}
            />
          </DemoContainer>
        </LocalizationProvider>
        <Button
          onClick={() => handleLeftAndFrozenStudents()}
          variant="outlined"
          sx={{
            border: "solid",
            borderColor: "#C4C4C4",
            borderWidth: 1,
            padding: {
              xs: "0px 12px",
              sm: "8px 12px",
            },
            height: {
              xs: "40px",
              sm: "56px",
            },
            fontSize: "12px",
            gap: "10px ",
            color: "#000",
            fontWeight: "semibold",
            marginTop: "8px",
          }}
        >
          <TbAdjustmentsHorizontal color="#c4c4c4" size={25} />
          {!isShow ? t("show_all") : t("hide_left_frozen")}
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        onScroll={handleScroll}
        ref={tableContainerRef}
        sx={{
          position: "relative",
          marginBottom: {
            xs: "50px",
            sm: "100px",
            md: "200px",
          },
          borderRadius: "0px 0px 4px 4px",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell
                sx={{
                  minWidth: 150,
                  backgroundColor: "white",
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  boxShadow: isScrolled
                    ? `inset -2px 0px ${theme.palette.primary.main}`
                    : "none",
                }}
              >
                {t("students_days")}
              </TableCell>
              <TableCell sx={{ minWidth: 80 }} align="right">
                {t("more")}
              </TableCell>
              {days.map((date) => (
                <TableCell
                  key={date.toString()}
                  align="center"
                  sx={{
                    backgroundColor:
                      date.toDateString() === today.toDateString()
                        ? "primary.light"
                        : "transparent",

                    minWidth: 80,
                    cursor: "pointer",
                    color: lessons.find(
                      (l) =>
                        l?.status === "cancelled" &&
                        l?.date === dayjs(date).format("YYYY-MM-DD")
                    )
                      ? "red"
                      : "auto",
                  }}
                >
                  <LessonControlPanel
                    isAllowed={isAllowed}
                    groupStartDate={group?.startDate as string}
                    groupId={group?._id}
                    date={date}
                    lessons={lessons}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {students && students?.length > 0 ? (
              students
                ?.filter(
                  (student) =>
                    !!student?.groups?.find(
                      (g) =>
                        (g.group._id === group?._id && g.status === "ACTIVE") ||
                        isShow
                    )
                )
                .map((student, index) => (
                  <TableRow
                    key={student._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        backgroundColor: "white",
                        position: "sticky",
                        left: 0,
                        zIndex: 1,
                        boxShadow: isScrolled
                          ? `inset -2px 0px ${theme.palette.primary.main}`
                          : "none",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          lineHeight: "16px",
                        }}
                      >
                        {capitalizeWords(student?.fullName)}
                      </Typography>

                      <Chip
                        size="small"
                        color={
                          student?.groups?.filter(
                            (el) => el.group._id === group?._id
                          )[0].status === "LEFT"
                            ? "error"
                            : student?.groups?.filter(
                                (el) => el.group._id === group?._id
                              )[0].status === "FROZEN"
                            ? "info"
                            : "success"
                        }
                        variant="filled"
                        sx={{
                          borderRadius: "4px",
                          marginTop: "4px",
                          fontSize: "12px",
                          fontWeight: "semibold",
                          paddingX: "12",
                          paddingY: "4",
                        }}
                        label={
                          student?.groups?.find(
                            (el) => el.group._id === group?._id
                          )?.status
                        }
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <StudentControlPanel
                        isAllowed={isAllowed}
                        groupStartDate={group?.startDate}
                        student={student}
                        groupId={group?._id}
                      />
                    </TableCell>
                    {days.map((date) => {
                      const attend = attendance?.find(
                        (a) =>
                          a?.student === student._id &&
                          a?.date === dayjs(date).format("YYYY-MM-DD")
                      );

                      const cancelled = lessons.find(
                        (l) =>
                          l?.status === "cancelled" &&
                          l?.date === dayjs(date).format("YYYY-MM-DD")
                      );
                      return (
                        <TableCell align="right" key={date.toString()}>
                          <AttendBtn
                            date={date}
                            attend={attend}
                            cancelled={cancelled}
                            studentId={student._id}
                            groupId={group._id}
                            isAllowed={isAllowed}
                            studentStatus={
                              student?.groups?.filter(
                                (el) => el.group._id === group?._id
                              )[0].status
                            }
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={days?.length + 2} align="center">
                  {t("no_data")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};
