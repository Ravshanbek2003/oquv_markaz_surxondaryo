import {
  useDeleteBranchMutation,
  useGetAllBranchesQuery,
  useUpdateBranchMutation,
} from "@/app/api";
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useHandleRequest } from "@/hooks";
import { useState } from "react";
import { IoMdPlay, IoMdTrash } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { Props } from "./types";
import toast from "react-hot-toast";
import { HiMiniPause } from "react-icons/hi2";
import { Status } from "@/constants";
import { Alert, Loader } from "@/components";
import { formatAmount } from "@/utils";
import { useTranslation } from "react-i18next";

export const Branches = ({ onModalChange, setSelectedBranch }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "settings.ceo.branches" });
  const { data: { branches } = {}, isLoading } = useGetAllBranchesQuery({});
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();
  const [updateStatus] = useUpdateBranchMutation();
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [branchId, setBranchId] = useState<string>("");
  const handleRequest = useHandleRequest();

  const onDelete = (id: string) => {
    handleRequest({
      request: async () => {
        const result = await deleteBranch({ id }).unwrap();
        return result;
      },
      onSuccess: () => {
        setOpenAlert(false);
        toast.success(`${t("toast.title_1")}`);
      },
    });
  };

  const onStatusChange = (id: string, status: Status) => {
    setUpdateLoading(id);
    handleRequest({
      request: async () => {
        const result = await updateStatus({
          id,
          body: {
            status: status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE,
          },
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        setUpdateLoading(null);
        toast.success(`${t("toast.title_2")}`);
      },
    });
  };

  const handleModalChange = (id: string) => {
    setSelectedBranch(id);
    onModalChange();
  };

  if (isLoading) {
    return <Loader sx={{ backgroundColor: "transparent", height: "50vh" }} />;
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
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("branch_name")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("status")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="center"
              >
                {t("balance")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="center"
              >
                {t("more")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches?.map((branch, index) => (
              <TableRow
                key={branch._id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="justify">{branch.title}</TableCell>
                <TableCell align="justify">
                  <Typography
                    variant="subtitle2"
                    sx={{
                      backgroundColor: branch.status ? "green" : "gray",
                      color: "#fff",
                      borderRadius: 1,
                      width: "min-content",
                      px: 1,
                    }}
                  >
                    {branch.status ? "Active" : "Inactive"}
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: branch.balance < 0 ? "red" : "green",
                  }}
                >
                  {formatAmount(branch.balance) || "0"} UZS
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="warning"
                    size="medium"
                    onClick={() => handleModalChange(branch._id)}
                  >
                    <MdModeEdit size={15} />
                  </Button>
                  <Button
                    sx={{ mx: 1 }}
                    variant="outlined"
                    color={branch.status === Status.ACTIVE ? "info" : "success"}
                    size="medium"
                    onClick={() => onStatusChange(branch._id, branch.status)}
                  >
                    {updateLoading === branch._id ? (
                      <CircularProgress
                        sx={
                          branch.status === Status.ACTIVE
                            ? { color: "blue" }
                            : { color: "green" }
                        }
                        size={"1rem"}
                      />
                    ) : branch.status === Status.ACTIVE ? (
                      <HiMiniPause size={15} />
                    ) : (
                      <IoMdPlay size={15} />
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="medium"
                    onClick={() => {
                      setOpenAlert(true);
                      setBranchId(branch._id);
                    }}
                  >
                    <IoMdTrash size={15} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Alert
        title={t("alert.title")}
        text={t("alert.message")}
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        onClick={() => onDelete(branchId)}
        isLoading={isDeleting}
      />
    </>
  );
};
