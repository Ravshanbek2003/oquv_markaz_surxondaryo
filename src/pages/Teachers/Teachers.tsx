import {
  Avatar,
  Button,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { useEffect, useState } from "react";
import { AddModal } from "./_components";
import { useNavigate } from "react-router-dom";
import { useLazyGetAllStaffsQuery } from "@/app/api";
import { useDispatch, useSelector } from "react-redux";
import { Role } from "@/constants";
import { Loader } from "@/components";
import { useDebounce } from "use-debounce";
import { setTeacherId } from "@/app/slices";
import { formatUzbekPhoneNumber } from "@/utils";
import { useTranslation } from "react-i18next";

export const Teachers = () => {
  const { t } = useTranslation("", { keyPrefix: "teachers" });

  const branch = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const [
    getAllStaffs,
    { data: { staff } = {}, isFetching, isLoading: isGettingAllStaffs },
  ] = useLazyGetAllStaffsQuery();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedValue] = useDebounce(searchValue.trim(), 500);
  const handleNavigate = (id: string) => {
    dispatch(setTeacherId(id));
    navigate(`/teachers/${id}`);
  };

  useEffect(() => {
    if (branch.branch && getAllStaffs) {
      getAllStaffs({
        branchId: branch.branch,
        role: Role.TEACHER,
        search: debouncedValue,
      });
    }
  }, [branch.branch, debouncedValue, getAllStaffs]);

  if (isGettingAllStaffs) {
    return <Loader sx={{ height: "70vh", backgroundColor: "transparent" }} />;
  }

  return (
    <div className="pb-10">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          gap: {
            xs: "6px",
            sm: "auto",
          },
          pb: {
            xs: 1,
            sm: 2,
            md: 4,
          },
        }}
        justifyContent={"space-between"}
      >
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: {
              xs: "auto",
              md: "400px",
            },
          }}
        >
          <InputBase
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ ml: 1, flex: 1, boxShadow: "none" }}
            placeholder={t("search_placeholder")}
            inputProps={{ "aria-label": "search google maps" }}
          />
          <IconButton
            type="button"
            sx={{
              p: {
                xs: "4px",
                sm: "10px",
              },
            }}
            aria-label="search"
          >
            <IoSearchOutline size={20} />
          </IconButton>
        </Paper>
        <Button
          startIcon={<GoPlus />}
          variant="contained"
          color="primary"
          sx={{
            boxShadow: "none",
            textTransform: "none",
            padding: {
              xs: "4px 24px",
              sm: "10px 24px",
              md: "11px 24px",
            },
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("add_new_teacher")}
        </Button>
      </Stack>
      {isFetching ? (
        <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />
      ) : (
        <TableContainer
          color="primary"
          sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <Table
            sx={{
              minWidth: 650,
              bgcolor: "#fff",
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    width: {
                      xs: "6px",
                      sm: "30px",
                      md: "70px",
                    },
                    color: "primary.main",
                    fontWeight: "bold",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                  }}
                >
                  {t("full_name")}
                </TableCell>
                <TableCell
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                  align="justify"
                >
                  {t("phone_number")}
                </TableCell>
                <TableCell
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                  align="center"
                >
                  {t("groups")}
                </TableCell>
                <TableCell
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                  align="center"
                >
                  {t("percent")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff &&
              staff?.filter((teacher) => teacher.role !== "CEO").length ? (
                staff
                  ?.filter((teacher) => teacher.role !== "CEO")
                  ?.map((teacher, index) => (
                    <TableRow
                      key={teacher._id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell
                        onClick={() => handleNavigate(teacher._id)}
                        sx={{
                          cursor: "pointer",
                          textTransform: "capitalize",
                          ":hover": { color: "primary.main" },
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={teacher?.avatar}
                            sx={{
                              bgcolor: "primary.main",
                              textTransform: "uppercase",
                            }}
                          >
                            {teacher.fullName.charAt(0)}
                          </Avatar>
                          {teacher.fullName}
                        </div>
                      </TableCell>
                      <TableCell align="justify" sx={{ minWidth: "180px" }}>
                        {formatUzbekPhoneNumber(teacher.phoneNumber)}
                      </TableCell>
                      <TableCell align="center">{teacher.groups}</TableCell>
                      <TableCell align="center">
                        {teacher?.percent ? teacher?.percent + "%" : "0%"}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t("no_data_available")}
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
