import { useGetAllExpensesQuery } from "@/app/api";
import { Loader } from "@/components";
import { formatAmount } from "@/utils";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export const Expense = () => {
  const { t } = useTranslation("", {
    keyPrefix: "teachers.tabs.salary.salary_tabs.expense",
  });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const { teacherId } = useSelector(
    (state: { teacher: { teacherId: string } }) => state.teacher
  );
  const { pathname } = useLocation();

  const { data: { expenses } = {}, isLoading } = useGetAllExpensesQuery({
    branchId: branch,
    employeeId: teacherId || pathname.split("/")[2],
  });

  if (isLoading) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              #
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              {t("amount")}
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              {t("category")}
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              {t("description")}
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              {t("date")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses && expenses.length ? (
            expenses.map((expense, index) => (
              <TableRow
                key={expense._id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <p className="text-red-600">
                    - {formatAmount(expense.amount)} UZS
                  </p>
                </TableCell>
                <TableCell>{expense?.category?.title || "No data"}</TableCell>
                <TableCell>
                  <p className="max-w-[300px]">{expense.description}</p>
                </TableCell>
                <TableCell>
                  {dayjs(expense.date).format("DD-MM-YYYY")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                {t("no_data_available")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
