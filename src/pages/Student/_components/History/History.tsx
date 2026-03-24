/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLazyGetStudentLogsQuery } from "@/app/api";
import { Loader, SingleSelect } from "@/components";
import { pageOptions } from "@/constants";
import {
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function History({ userId }: { userId: string }) {
  const { t } = useTranslation("", {
    keyPrefix: "students.student.history_tabs",
  });
  const [
    getStudentLogs,
    { data: { logs, count, total, page, perPage } = {}, isLoading, isFetching },
  ] = useLazyGetStudentLogsQuery();
  const [pagination, setPagination] = useState<{
    page?: number;
    perPage?: number;
  }>({ page: 1, perPage: 10 });

  useEffect(() => {
    if (userId && getStudentLogs) {
      getStudentLogs({
        studentId: userId,
        page: pagination.page,
        perPage: pagination.perPage,
      });
    }
  }, [userId, pagination.page, pagination.perPage]);

  if (isLoading || isFetching) {
    return <Loader sx={{ height: "40vh", backgroundColor: "transparent" }} />;
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                {t("employee")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {t("student")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {t("group")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {t("status_changed")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {t("current_status")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {t("previous_status")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs && logs.length ? (
              logs?.map((log, index) => (
                <TableRow key={log?._id} sx={{ border: 0 }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "500px",
                      color: log?.user?.fullName ? "black" : "red",
                    }}
                  >
                    <p>{log?.user?.fullName || t("deleted_employee")}</p>
                  </TableCell>
                  <TableCell align="center">{log?.student?.fullName}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      maxWidth: "500px",
                      color: log?.group?.name ? "black" : "red",
                    }}
                  >
                    {log?.group?.name || t("deleted_group")}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(log.createdAt).toLocaleString("ru-RU")}
                  </TableCell>
                  <TableCell align="center">{log?.newStatus}</TableCell>
                  <TableCell align="center">{log?.oldStatus}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {t("no_date_available")}
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
  );
}
