/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDeleteExpenseMutation,
  useLazyGetAllExpensesQuery,
} from "@/app/api";
import { Loader } from "@/components";
import { useHandleRequest } from "@/hooks";
import { useTheme } from "@mui/material/styles";
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { AddExpense as EditExpense } from "../AddExpense";
import { Props } from "./types";
import { formatAmount } from "@/utils";
import { useTranslation } from "react-i18next";

export const Expense = ({ expenseDate }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "budget.expense" });
  const { branch } = useSelector((state: any) => state.branch);
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();
  const [
    getAllExpenses,
    { data: { expenses } = {}, isLoading: isGetting, isFetching },
  ] = useLazyGetAllExpensesQuery();

  const [editModal, setEditModal] = useState<{ open: boolean; id: string }>({
    id: "",
    open: false,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expenseID, setExpenseID] = useState("");
  const [totalExpense, setTotalExpense] = useState(0);
  const handleRequest = useHandleRequest();
  const theme = useTheme();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setExpenseID(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await deleteExpense({ id }).unwrap();
        return result;
      },
      onSuccess: () => {
        handleClose();
        toast.success(t("toast"));
      },
    });
  };

  useEffect(() => {
    if (
      branch &&
      getAllExpenses &&
      expenseDate.endDate &&
      expenseDate.startDate
    ) {
      getAllExpenses({
        branchId: branch,
        startDate: expenseDate.startDate as string,
        endDate: expenseDate.endDate as string,
      });
    }
  }, [branch, expenseDate.endDate, expenseDate.startDate]);

  useEffect(() => {
    if (expenses) {
      const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
      setTotalExpense(total);
    }
  }, [expenses]);

  if (isGetting || isFetching) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
  }

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 900,
          fontSize: 30,
          marginBottom: 2,
          marginTop: 4,
        }}
      >
        {t("total")}: {formatAmount(totalExpense)} UZS
      </Typography>
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
                {t("employee")}
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
                {t("category")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("description")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="center"
              >
                {t("date")}
              </TableCell>
              <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                {t("payer")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="center"
              >
                {t("payment_method")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="center"
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses && expenses.length ? (
              expenses.map((expense, index) => (
                <TableRow
                  key={expense._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{expense?.employee?.fullName}</TableCell>
                  <TableCell align="justify">
                    <p className="text-red-500">
                      -{formatAmount(expense.amount)} UZS
                    </p>
                  </TableCell>
                  <TableCell align="justify">
                    {expense.category.title}
                  </TableCell>
                  <TableCell align="justify">
                    <p className="text-start max-w-[200px]">
                      {expense.description}
                    </p>
                  </TableCell>
                  <TableCell align="center">{expense.date}</TableCell>
                  <TableCell component="th" scope="row">
                    {expense?.payer?.fullName}
                  </TableCell>
                  <TableCell align="center">{expense.paymentMethod}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(event) => handleClick(event, expense._id)}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <BsThreeDotsVertical className="cursor-pointer" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t("no_data_available")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        sx={{ marginLeft: "-50px" }}
      >
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "orange",
          }}
          onClick={() => {
            setEditModal({ open: true, id: expenseID });
            handleClose();
          }}
        >
          <span>
            <MdModeEdit size={18} />
          </span>
          {t("menu.edit")}
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "red",
          }}
          onClick={() => onDelete(expenseID)}
        >
          <span>
            {isDeleting ? (
              <CircularProgress sx={{ color: "inherit" }} size={"1rem"} />
            ) : (
              <IoMdTrash size={18} />
            )}
          </span>
          {t("menu.delete")}
        </MenuItem>
      </Menu>
      <EditExpense
        open={editModal.open}
        onClose={() => setEditModal({ open: false, id: "" })}
        selectedExpenseId={editModal.id}
      />
    </>
  );
};
