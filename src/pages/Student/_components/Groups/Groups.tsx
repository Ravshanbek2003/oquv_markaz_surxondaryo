import { useDeletePaymentMutation, useGetAllPaymentsQuery } from "@/app/api";
import { GetStudentResponse } from "@/app/api/studentApi/types";
import { Alert, Loader } from "@/components";
import { DAYS_3LETTER, LogsStatus } from "@/constants";
import { useHandleRequest } from "@/hooks";
import { formatAmount } from "@/utils";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { IoMdTrash } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const Groups = ({ user }: { user: GetStudentResponse }) => {
  const { t } = useTranslation("", {
    keyPrefix: "students.student.groups_tabs",
  });

  const TABLE_HEADER_VALUE = [
    "#",
    t("table.date"),
    t("table.amount"),
    t("table.group"),
    t("table.receiver"),
    "",
  ];

  const { data: { payments } = {}, isLoading: isGettingPayment } =
    useGetAllPaymentsQuery({
      student: user?._id,
    });

  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();
  const [openAlert, setOpenAlert] = useState<{ open: boolean; id: string }>({
    open: false,
    id: "",
  });

  const handleClose = () => setOpenAlert({ open: false, id: "" });
  const handleRequest = useHandleRequest();
  const navigate = useNavigate();

  const onDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await deletePayment({ id }).unwrap();
        return result;
      },
      onSuccess: () => {
        handleClose();
        toast.success(`${t("toast")}`);
      },
    });
  };

  return (
    <>
      <Box
        sx={{
          paddingBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: {
            xs: 1,
            sm: 1,
            md: 1,
            lg: 2,
          },
        }}
      >
        {user?.groups?.map((group) => (
          <Card
            key={group?._id}
            sx={{
              width: {
                xs: "100%",
                sm: "300px",
                md: "400px",
                lg: "450px",
              },
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <div>
                  <div className="flex justify-between mt-2 text-black">
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: group?.group?.name ? "black" : "red",
                      }}
                    >
                      {group?.group?.name || t("deleted_group")}
                    </Typography>

                    <Typography
                      sx={{ fontSize: "14px", color: "primary.main" }}
                    >
                      {t("group_name")}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-1 text-black">
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: "medium",
                        color: "black",
                      }}
                    >
                      {group?.group?.course?.title || t("deleted_course")}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "14px", color: "primary.main" }}
                    >
                      {t("course")}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-1 text-black">
                    <span>
                      {new Date(
                        group?.group?.startDate || ""
                      ).toLocaleDateString("ru-RU")}
                    </span>
                    <Typography
                      sx={{ fontSize: "14px", color: "primary.main" }}
                    >
                      {t("start_date")}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-1 text-black">
                    <span>
                      {new Date(group?.group?.endDate || "").toLocaleDateString(
                        "ru-RU"
                      )}
                    </span>
                    <Typography
                      sx={{ fontSize: "14px", color: "primary.main" }}
                    >
                      {t("end_date")}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-1 text-black">
                    <span>
                      {new Date(group.startDate || "").toLocaleDateString(
                        "ru-RU"
                      )}
                    </span>
                    <Typography
                      sx={{ fontSize: "14px", color: "primary.main" }}
                    >
                      {t("joined_date")}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-1 text-black">
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor:
                          group.status === LogsStatus.ACTIVE
                            ? "green"
                            : group.status === LogsStatus.FROZEN
                            ? "blue"
                            : "red",
                        color: "white",
                        px: 1,
                        py: "1px",
                        borderRadius: "4px",
                      }}
                    >
                      {group.status}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "14px", color: "primary.main" }}
                    >
                      {t("current_status")}
                    </Typography>
                  </div>
                </div>
              </Typography>
              <Divider sx={{ my: 2 }} />
              <div className="flex justify-between items-center mt-2 text-black">
                <div className="">
                  <span>
                    {Math.floor(group?.group?.startTime / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {(group?.group?.startTime % 60).toString().padStart(2, "0")}{" "}
                    -{" "}
                    {Math.floor(
                      (group?.group?.startTime +
                        group?.group?.course?.lessonDuration) /
                        60
                    )
                      .toString()
                      .padStart(2, "0")}
                    :
                    {(
                      (group?.group?.startTime +
                        group?.group?.course?.lessonDuration) %
                      60
                    )
                      .toString()
                      .padStart(2, "0")}
                  </span>
                  <p>
                    {group?.group?.days
                      .map((el) => DAYS_3LETTER[el % 7])
                      .join(", ")}
                  </p>
                </div>
                <Button
                  id="basic-button"
                  color="primary"
                  sx={{
                    width: "120px",
                    marginLeft: "10px",
                    height: "45px",
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                  onClick={() => navigate(`/groups/${group.group._id}`)}
                >
                  {t("see_group")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </Box>
      {isGettingPayment ? (
        <Loader sx={{ backgroundColor: "transparent", height: "30vh" }} />
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {TABLE_HEADER_VALUE.map((header, index) => (
                  <TableCell
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                    key={index}
                    align="justify"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments && payments.length ? (
                payments?.map((transaction, index) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{transaction?.date || "-"}</TableCell>
                    <TableCell>
                      <p className="text-green-500">
                        +{formatAmount(transaction?.amount)} UZS
                      </p>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: transaction?.group?.name ? "black" : "red",
                      }}
                    >
                      {transaction?.group?.name || t("deleted_group")}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: transaction?.receiver?.fullName
                          ? "black"
                          : "red",
                      }}
                    >
                      {transaction?.receiver?.fullName || t("deleted_receiver")}
                    </TableCell>
                    <TableCell>
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
                          setOpenAlert({ id: transaction?._id, open: true })
                        }
                      >
                        <IoMdTrash size={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                    {t("no_groups_available")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Alert
        title={t("alert.delete_payment")}
        text={t("alert.message")}
        open={openAlert?.open}
        onClose={handleClose}
        onClick={() => onDelete(openAlert?.id)}
        buttonText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
};
