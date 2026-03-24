import { useGetPaymentIncomeQuery } from "@/app/api";
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

export const Income = () => {
  const { t } = useTranslation("", {
    keyPrefix: "teachers.tabs.salary.salary_tabs.income",
  });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const { teacherId } = useSelector(
    (state: { teacher: { teacherId: string } }) => state.teacher
  );
  const { pathname } = useLocation();

  const { data: { payments } = {}, isLoading } = useGetPaymentIncomeQuery({
    branch,
    teacher: teacherId || pathname.split("/")[2],
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
              {t("group")}
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              {t("student")}
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              {t("payment_date")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments && payments.length ? (
            payments.map((payment, index) => (
              <TableRow
                key={payment._id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <p className="text-green-500">
                    + {formatAmount(payment.amount)} UZS
                  </p>
                </TableCell>
                <TableCell
                  sx={{ color: payment?.group?.name ? "black" : "red" }}
                >
                  {payment?.group?.name || t("deleted_group")}
                </TableCell>
                <TableCell
                  sx={{ color: payment?.student?.fullName ? "black" : "red" }}
                >
                  {payment?.student?.fullName || t("deleted_student")}
                </TableCell>
                <TableCell>
                  {dayjs(payment.date).format("DD.MM.YYYY")}
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
  );
};
