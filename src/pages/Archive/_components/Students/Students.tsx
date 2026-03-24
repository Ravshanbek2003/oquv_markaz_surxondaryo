/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDeleteStudentMutation,
  useLazyGetAllStudentsQuery,
  useUpdateStudentMutation,
} from "@/app/api";
import { Alert, Loader, SingleSelect } from "@/components";
import { pageOptions, Status } from "@/constants";
import { useHandleRequest } from "@/hooks";
import { formatUzbekPhoneNumber } from "@/utils";
import {
  CircularProgress,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { IoMdTrash } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import { useSelector } from "react-redux";

export const Students = () => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.archive.students_tabs",
  });
  const { branch } = useSelector((state: any) => state.branch);
  const [activeStudent, { isLoading: isActivating }] =
    useUpdateStudentMutation();
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [
    getAllStudents,
    {
      data: { students, count, total, page, perPage } = {},
      isLoading: isGetting,
    },
  ] = useLazyGetAllStudentsQuery();

  const [isDeleteStudent, setIsDeleteStudent] = useState<{
    id: string;
    open: boolean;
  }>({ id: "", open: false });
  const [isLoading, setIsLoading] = useState<{
    activate?: string;
  }>({
    activate: "",
  });
  const [pagination, setPagination] = useState<{
    page?: number;
    perPage?: number;
  }>({ page: 1, perPage: 10 });

  const handleRequest = useHandleRequest();

  const onActive = async (id: string) => {
    setIsLoading({ activate: id });
    await handleRequest({
      request: async () => {
        const result = await activeStudent({
          id,
          body: { status: Status.ACTIVE },
        });
        return result;
      },
      onSuccess: () => {
        setIsLoading({ activate: "" });
        toast.success(t("toast.title_1"));
      },
    });
  };

  const onDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await deleteStudent({ id });
        return result;
      },
      onSuccess: () => {
        setIsDeleteStudent({ id: "", open: false });
        toast.success(t("toast.title_2"));
      },
    });
  };

  useEffect(() => {
    if (branch) {
      getAllStudents({
        branchId: branch,
        page: pagination.page,
        perPage: pagination.perPage,
        status: Status.INACTIVE,
      });
    }
  }, [branch, pagination.page, pagination.perPage]);

  if (isGetting) {
    return <Loader sx={{ height: "60vh", backgroundColor: "transparent" }} />;
  }

  return (
    <>
      <TableContainer sx={{ borderRadius: "8px", border: "1px solid #ccc" }}>
        <Table
          sx={{ minWidth: 650, bgcolor: "#fff" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                #
              </TableCell>
              <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                {t("name")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="center"
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
                {t("action")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students && students.length ? (
              students.map((student, index) => (
                <TableRow
                  key={student._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {(Number(page || 1) - 1) * Number(perPage || 10) +
                      index +
                      1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {student.fullName}
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: "180px" }}>
                    {formatUzbekPhoneNumber(student.phoneNumber as string)}
                  </TableCell>
                  <TableCell align="center">
                    <p>
                      {student.groups
                        .map((group) => group.group.name)
                        .join(", ") || "No data"}
                    </p>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      display: "flex",
                      gap: "20px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      color="success"
                      sx={{
                        padding: "4px",
                        width: "32px",
                        height: "32px",
                        border: "1px solid",
                        borderColor: "success.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                      }}
                      onClick={() => onActive(student._id)}
                    >
                      {isLoading.activate === student._id && isActivating ? (
                        <CircularProgress color="inherit" size={"1rem"} />
                      ) : (
                        <LuRefreshCcw size={15} />
                      )}
                    </IconButton>
                    <IconButton
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
                      onClick={() =>
                        setIsDeleteStudent({ id: student._id, open: true })
                      }
                    >
                      <IoMdTrash size={20} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {t("no_data")}
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

      <Alert
        title={t("alert.title")}
        text={t("alert.message")}
        open={isDeleteStudent.open}
        onClick={() => onDelete(isDeleteStudent.id)}
        onClose={() => setIsDeleteStudent({ id: "", open: false })}
        isLoading={isDeleting}
      />
    </>
  );
};
