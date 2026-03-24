/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDeleteStaffMutation,
  useGetAllStaffsQuery,
  useUpdateStaffMutation,
} from "@/app/api";
import { Alert, Loader } from "@/components";
import { Status } from "@/constants";
import { useHandleRequest } from "@/hooks";
import { formatUzbekPhoneNumber } from "@/utils";
import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { IoMdTrash } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import { useSelector } from "react-redux";

export const Staff = () => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.archive.staff_tabs",
  });
  const { branch } = useSelector((state: any) => state.branch);
  const [activateStaff, { isLoading: isActivating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const { data: { staff } = {}, isLoading: isGetting } = useGetAllStaffsQuery({
    branchId: branch,
    status: Status.INACTIVE,
  });

  const [isDeleteStaff, setIsDeleteStaff] = useState<{
    id: string;
    open: boolean;
  }>({ id: "", open: false });
  const [isLoading, setIsLoading] = useState("");
  const handleRequest = useHandleRequest();

  const onActivate = async (id: string) => {
    setIsLoading(id);
    await handleRequest({
      request: async () => {
        const result = await activateStaff({
          id,
          body: { status: Status.ACTIVE },
        });
        return result;
      },
      onSuccess: () => {
        setIsLoading("");
        toast.success(t("toast.title_1"));
      },
    });
  };

  const onDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await deleteStaff({ id });
        return result;
      },
      onSuccess: () => {
        setIsDeleteStaff({ id: "", open: false });
        toast.success(t("toast.title_2"));
      },
    });
  };

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
                {t("role")}
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
            {staff && staff.length ? (
              staff.map((staff, index) => (
                <TableRow
                  key={staff._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{staff.fullName}</TableCell>
                  <TableCell align="center" sx={{ minWidth: "180px" }}>
                    {formatUzbekPhoneNumber(staff.phoneNumber as string)}
                  </TableCell>
                  <TableCell align="center">{staff.role}</TableCell>
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
                      onClick={() => onActivate(staff._id)}
                    >
                      {isActivating && isLoading === staff._id ? (
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
                        setIsDeleteStaff({ id: staff._id, open: true })
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
      <Alert
        title={t("alert.title")}
        text={t("alert.message")}
        open={isDeleteStaff.open}
        onClose={() => setIsDeleteStaff({ id: "", open: false })}
        onClick={() => onDelete(isDeleteStaff.id)}
        isLoading={isDeleting}
      />
    </>
  );
};
