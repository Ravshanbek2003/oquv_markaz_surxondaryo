import { useTheme } from "@mui/material/styles";
import {
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { useGetAllGroupsQuery, useLazyGetPaymentIncomeQuery } from "@/app/api";
import { useSelector } from "react-redux";
import { Loader } from "@/components";
import { formatAmount, formatUzbekPhoneNumber } from "@/utils";
import { useEffect, useState } from "react";
import { Props } from "./types";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
export const Income = ({ incomeDate }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "budget.income" });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const { data: { groups } = {}, isLoading: isGettingGroups } =
    useGetAllGroupsQuery({ branch });
  const [selectedGroup, setSelectedGroup] = useState("");
  const [
    getIncomeData,
    { data: { payments } = {}, isLoading: isGettingPayments, isFetching },
  ] = useLazyGetPaymentIncomeQuery();
  const [totalIncome, setTotalIncome] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (branch && getIncomeData && incomeDate.endDate && incomeDate.startDate) {
      getIncomeData({
        branch,
        group: selectedGroup,
        startDate: incomeDate.startDate as string,
        endDate: incomeDate.endDate as string,
      });
    }
  }, [branch, incomeDate.endDate, incomeDate.startDate, selectedGroup]);

  useEffect(() => {
    if (payments) {
      const total = payments.reduce((acc, payment) => acc + payment.amount, 0);
      setTotalIncome(total);
    }
  }, [payments]);

  if (isGettingGroups || isGettingPayments || isFetching) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
  }

  return (
    <div>
      <Stack
        direction="row"
        sx={{
          gap: {
            xs: "8px",
            sm: "20px",
          },
        }}
        alignItems="center"
      >
        <Select
          IconComponent={IoIosArrowDown}
          sx={{
            border: "none",
            outline: "none",
            paddingRight: {
              xs: "6px",
              sm: "13px",
            },
            ".MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:focus": { outline: "none" },
            fontSize: {
              xs: "18px",
              sm: "26px",
              md: "34px",
            },
            fontWeight: "bold",
            color: theme.palette.primary.main,
            width: "fit-content",
            ".MuiSelect-icon": {
              color: theme.palette.primary.main,
              transition: "transform 0.2s ease-in-out",
              right: "0px",
            },
          }}
          displayEmpty
          renderValue={(value) => {
            if (value) {
              return groups?.find((group) => group._id === value)?.name;
            }
            return t("all_groups");
          }}
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <MenuItem value="">{t("all_groups")}</MenuItem>
          {groups?.map((group) => (
            <MenuItem value={group._id} key={group._id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
        <Typography
          variant="h1"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 900,
            fontSize: {
              xs: "16px",
              sm: "24px",
              md: "30px",
            },
          }}
        >
          {t("total")} : {formatAmount(totalIncome)} UZS
        </Typography>
      </Stack>
      <TableContainer
        color="primary"
        sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
      >
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
                align="justify"
              >
                {t("amount")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("date")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("groups")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments && payments.length ? (
              payments.map((item, index) => (
                <TableRow
                  key={item._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {item?.student?.fullName || "No data"}
                  </TableCell>
                  <TableCell align="justify" sx={{ minWidth: "180px" }}>
                    {formatUzbekPhoneNumber(item.student.phoneNumber as string)}
                  </TableCell>
                  <TableCell align="justify">
                    <p className="text-green-500">
                      +{formatAmount(item.amount)} UZS
                    </p>
                  </TableCell>
                  <TableCell align="justify">
                    <p>{dayjs(item.date).format("DD-MM-YYYY")}</p>
                  </TableCell>
                  <TableCell
                    align="justify"
                    sx={{ color: item?.group?.name ? "black" : "red" }}
                  >
                    <p>{item?.group?.name || t("deleted_group")}</p>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t("no_data_available")}{" "}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
