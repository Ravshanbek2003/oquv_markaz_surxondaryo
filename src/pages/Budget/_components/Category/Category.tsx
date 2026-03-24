import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from "@/app/api";
import { Loader } from "@/components";
import { useHandleRequest } from "@/hooks";
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
import { Props } from "./types";
import { IoMdTrash } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";

export const Category = ({ onModalChange, setSelectedCategory }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "budget.category" });
  const { data: { categories } = {}, isLoading } = useGetAllCategoriesQuery({});
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const handleRequest = useHandleRequest();

  const onDelete = async (id: string) => {
    setDeleteLoading(id);
    await handleRequest({
      request: async () => {
        const result = await deleteCategory({ id }).unwrap();
        return result;
      },
      onSuccess: () => {
        setDeleteLoading(null);
        toast.success(t("toast"));
      },
    });
  };

  const handleModalChange = (id: string) => {
    setSelectedCategory(id);
    onModalChange();
  };

  if (isLoading) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
  }

  return (
    <>
      <TableContainer
        color="primary"
        sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
      >
        <Table
          sx={{
            minWidth: {
              xs: 300,
              sm: 500,
              md: 650,
            },
            bgcolor: "#fff",
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{
                  width: "50px",
                  color: "primary.main",
                  fontWeight: "bold",
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="left"
              >
                {t("category")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="right"
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories && categories.length ? (
              categories?.map((category, index) => (
                <TableRow
                  key={category._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    align="left"
                    sx={{ width: "20px" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{category.title}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ display: "flex", gap: "10px", alignItems: "center" }}
                  >
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
                      onClick={() => onDelete(category._id)}
                    >
                      {deleteLoading === category._id ? (
                        <CircularProgress sx={{ color: "red" }} size={"1rem"} />
                      ) : (
                        <IoMdTrash size={20} />
                      )}
                    </IconButton>
                    <IconButton
                      color="warning"
                      sx={{
                        padding: "4px",
                        width: "32px",
                        height: "32px",
                        border: "1px solid",
                        borderColor: "warning.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                      }}
                      onClick={() => handleModalChange(category._id)}
                    >
                      <MdModeEdit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  {t("no_data")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
