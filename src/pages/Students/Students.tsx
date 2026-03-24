/* eslint-disable @typescript-eslint/no-explicit-any */
import { MultipleSelect } from "@/components/MultipleSelect";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AddModal } from "./_components";
import { useEffect, useState } from "react";
import { IoChatbubbleOutline, IoSearchOutline } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";
import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import {
  useGetAllGroupsQuery,
  useGetAllStaffsQuery,
  useLazyGetAllStudentsQuery,
} from "@/app/api";
import { useSelector } from "react-redux";
import { Loader, SingleSelect } from "@/components";
import { pageOptions, Role, Status } from "@/constants";
import { useGetAllCoursesQuery } from "@/app/api/courseApi";
import { useDebounce } from "use-debounce";
import { formatUzbekPhoneNumber } from "@/utils";
import { useTranslation } from "react-i18next";

export const Students = () => {
  const { t } = useTranslation("", { keyPrefix: "students" });
  const { branch } = useSelector((state: any) => state.branch);
  const { data: { staff } = {} } = useGetAllStaffsQuery({
    branchId: branch,
    role: Role.TEACHER,
  });

  const { data: { groups } = {} } = useGetAllGroupsQuery({ branch });
  const { data: { courses } = {} } = useGetAllCoursesQuery({
    branchID: branch,
  });

  const [filters, setFilters] = useState<{
    courses: string[];
    groups: string[];
    teachers: string[];
    search: string;
  }>({ courses: [], groups: [], teachers: [], search: "" });
  const [
    getAllStudents,
    {
      data: { students, count, total, page, perPage } = {},
      isLoading: isGettingAllStudents,
      isFetching,
    },
  ] = useLazyGetAllStudentsQuery();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [debouncedValue] = useDebounce(filters.search.trim(), 500);
  const [pagination, setPagination] = useState<{
    page?: number;
    perPage?: number;
  }>({ page: 1, perPage: 10 });
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilter = (
    key: "courses" | "groups" | "teachers",
    value: string[]
  ) => {
    setFilters((prev) => {
      return { ...prev, [key]: value };
    });
  };

  useEffect(() => {
    if (branch && getAllStudents) {
      getAllStudents({
        branchId: branch,
        groupId: filters?.groups.join(","),
        courseId: filters?.courses.join(","),
        teacherId: filters?.teachers.join(","),
        search: debouncedValue,
        page: pagination.page,
        perPage: pagination.perPage,
        status: Status.ACTIVE,
      });
    }
  }, [
    branch,
    filters?.courses,
    filters?.groups,
    filters?.teachers,
    getAllStudents,
    debouncedValue,
    pagination.page,
    pagination.perPage,
  ]);

  if (isGettingAllStudents) {
    return <Loader sx={{ height: "70vh", backgroundColor: "transparent" }} />;
  }

  return (
    <div className="pb-10">
      <Box
        sx={{
          pb: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
          },
          display: "flex",
          gap: "6px",
          flexDirection: {
            xs: "column-reverse",
            sm: "row",
          },
        }}
      >
        <Box
          sx={{
            gap: {
              xs: "6px",
              lg: "8px",
              xl: "10px",
            },
            display: "flex",
            flexDirection: {
              xs: "column",
              lg: "row",
            },
          }}
        >
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: {
                xs: "100%",
                lg: "160px",
                xl: "213px",
              },
            }}
          >
            <InputBase
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              sx={{ ml: 1, flex: 1, boxShadow: "none" }}
              placeholder={t("search_placeholder")}
              inputProps={{ "aria-label": "search google maps" }}
            />
            <IconButton
              type="button"
              sx={{
                p: {
                  xs: "4px",
                  sm: "8px",
                  md: "10px",
                },
                paddingX: {
                  xs: "4px",
                  sm: "8px",
                  lg: "6px",
                  xl: "10px",
                },
              }}
              aria-label="search"
            >
              <IoSearchOutline />
            </IconButton>
          </Paper>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",

              justifyContent: "space-between",
              gap: {
                xs: "4px",
                sm: "8px",
                md: "10px",
                lg: "8px",
                xl: "10px",
              },
            }}
          >
            <MultipleSelect
              sx={{
                width: {
                  xs: "100%",
                  sm: "150px",
                  md: "150px",
                  lg: "130px",
                  xl: "150px",
                },
              }}
              names={
                groups?.map((group) => ({
                  label: group.name,
                  value: group?._id,
                })) || []
              }
              label={t("group_label")}
              value={filters.groups}
              onChange={(value) => handleFilter("groups", value)}
            />
            <MultipleSelect
              sx={{
                width: {
                  xs: "100%",
                  sm: "150px",
                  md: "150px",
                  lg: "130px",
                  xl: "150px",
                },
              }}
              names={
                staff?.map((staff) => ({
                  label: staff.fullName,
                  value: staff?._id,
                })) || []
              }
              label={t("teacher_label")}
              value={filters?.teachers}
              onChange={(value) => handleFilter("teachers", value)}
            />
          </Box>
          <Box
            sx={{
              width: {
                xs: "auto",
              },
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: {
                xs: "4px",
                sm: "8px",
                md: "10px",
                lg: "8px",
                xl: "10px",
              },
            }}
          >
            <MultipleSelect
              sx={{
                width: {
                  xs: "100%",
                  sm: "150px",
                  md: "150px",
                  lg: "130px",
                  xl: "150px",
                },
              }}
              names={
                courses?.map((course) => ({
                  label: course?.title,
                  value: course?._id,
                })) || []
              }
              label={t("courses_label")}
              value={filters?.courses}
              onChange={(value) => handleFilter("courses", value)}
            />
            <Box sx={{ width: "100%" }}>
              <Button
                startIcon={<GrPowerReset />}
                variant="contained"
                color="inherit"
                sx={{
                  width: "100%",
                  height: "100%",
                  boxShadow: "none",
                  textTransform: "none",
                  bgcolor: "white",
                  border: "none",
                  padding: {
                    xs: "4px 24px",
                    sm: "9px 24px",
                    md: "11px 20px",
                    lg: "11px 18px",
                    xl: "11px 24px",
                  },
                  whiteSpace: "nowrap",
                }}
                disabled={
                  !filters.search &&
                  !filters?.courses?.length &&
                  !filters?.teachers?.length &&
                  !filters?.groups?.length
                }
                onClick={() =>
                  setFilters({
                    courses: [],
                    groups: [],
                    teachers: [],
                    search: "",
                  })
                }
              >
                {t("reset_filters")}
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "end",
            height: "100%",
            width: "100%",
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
                sm: "10px 14px",
                md: "11px 24px",
              },
              whiteSpace: "nowrap",
            }}
            onClick={() => setOpenAddModal(true)}
          >
            {t("add_button")}
          </Button>
        </Box>
      </Box>
      {isFetching ? (
        <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />
      ) : (
        <>
          <TableContainer
            sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <Table
              sx={{ minWidth: 650, bgcolor: "#fff" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    align="justify"
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    #
                  </TableCell>
                  <TableCell
                    align="justify"
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    {t("table.full_names")}
                  </TableCell>
                  <TableCell
                    align="justify"
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    {t("table.phone_number")}
                  </TableCell>
                  <TableCell
                    align="justify"
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    {t("table.groups")}
                  </TableCell>
                  <TableCell
                    align="justify"
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    {t("table.courses")}
                  </TableCell>
                  <TableCell
                    align="justify"
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    {t("table.teachers")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students && students.length ? (
                  students?.map((student, index) => (
                    <TableRow
                      key={student?._id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {(Number(page || 1) - 1) * Number(perPage || 10) +
                          index +
                          1}
                      </TableCell>
                      <TableCell
                        align="justify"
                        sx={{
                          textTransform: "capitalize",
                          ":hover": { color: "primary.main" },
                        }}
                      >
                        <Link to={`/students/${student?._id}`}>
                          {student.fullName}
                        </Link>
                      </TableCell>
                      <TableCell align="justify" sx={{ minWidth: "180px" }}>
                        {formatUzbekPhoneNumber(student.phoneNumber as string)}
                      </TableCell>
                      <TableCell align="justify">
                        {student.groups.filter(
                          (group) => group.status !== "LEFT"
                        ).length > 0
                          ? student.groups
                              .filter((group) => group.status !== "LEFT")
                              .map((group) => (
                                <p
                                  key={group?._id}
                                  style={{
                                    color: group?.group?.name ? "black" : "red",
                                  }}
                                >
                                  {group?.group?.name || t("deleted_group")}
                                </p>
                              ))
                          : "No data"}
                      </TableCell>
                      <TableCell align="justify">
                        {student.groups.filter(
                          (group) => group.status !== "LEFT"
                        ).length > 0
                          ? student.groups
                              .filter((group) => group.status !== "LEFT")
                              .map((group) => (
                                <p
                                  key={group?._id}
                                  style={{
                                    color: group?.group?.course?.title
                                      ? "black"
                                      : "red",
                                  }}
                                >
                                  {group?.group?.course?.title ||
                                    t("deleted_course")}
                                </p>
                              ))
                          : "No data"}
                      </TableCell>
                      <TableCell align="justify">
                        {student.groups.filter(
                          (group) => group.status !== "LEFT"
                        ).length > 0
                          ? student.groups
                              .filter((group) => group.status !== "LEFT")
                              .map((group) => (
                                <p
                                  key={group?._id}
                                  style={{
                                    color: group?.group?.teacher?.fullName
                                      ? "black"
                                      : "red",
                                  }}
                                >
                                  {group?.group?.teacher?.fullName ||
                                    t("deleted_teacher")}
                                </p>
                              ))
                          : "No data"}
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
          {total && total > 10 ? (
            <div className="flex items-end justify-center w-full">
              <Pagination
                count={count}
                shape="rounded"
                sx={{ mt: 4 }}
                size="medium"
                color="primary"
                page={pagination.page}
                onChange={(_, page) => setPagination({ page: page, perPage })}
              />
              <SingleSelect
                options={
                  pageOptions.map((i) => ({
                    value: String(i),
                    label: String(i),
                  })) || []
                }
                sx={{ maxWidth: "70px" }}
                size="small"
                value={String(pagination.perPage) as any}
                onChange={(e) =>
                  setPagination({ perPage: Number(e.target.value), page })
                }
              />
            </div>
          ) : null}
        </>
      )}

      <AddModal open={openAddModal} onClose={() => setOpenAddModal(false)} />
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{ marginLeft: "-50px" }}
      >
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "green",
          }}
        >
          <span>
            <IoChatbubbleOutline />
          </span>
          {t("menu.sms")}
        </MenuItem>
        <MenuItem sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>
            <IoMdAdd />
          </span>
          {t("menu.add_payment")}
        </MenuItem>
      </Menu>
    </div>
  );
};
