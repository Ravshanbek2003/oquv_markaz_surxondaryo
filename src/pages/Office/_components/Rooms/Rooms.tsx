/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteRoomMutation, useGetAllRoomsQuery } from "@/app/api";
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
import { useSelector } from "react-redux";
import { IoMdTrash } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";

export const Rooms = ({ onOpenChange, setSelectedRoom }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "settings.office.rooms_tabs" });
  const { branch } = useSelector((state: any) => state.branch);
  const { data: { rooms } = {}, isLoading } = useGetAllRoomsQuery({
    branchID: branch,
  });
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const handleRequest = useHandleRequest();

  const onDelete = async (id: string) => {
    setDeleteLoading(id);
    await handleRequest({
      request: async () => {
        const result = await deleteRoom({ id }).unwrap();
        return result;
      },
      onSuccess: () => {
        setDeleteLoading(null);
        toast.success(t("toast"));
      },
    });
  };

  const handleModalChange = (id: string) => {
    setSelectedRoom(id);
    onOpenChange();
  };

  if (isLoading) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
  }

  return (
    <div>
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
                  width: "20px",
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("room_name")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="right"
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms && rooms.length ? (
              rooms?.map((room, index) => (
                <TableRow
                  key={room._id}
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
                  <TableCell align="justify">{room.title}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ display: "flex", gap: "20px", alignItems: "center" }}
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
                      onClick={() => onDelete(room._id)}
                    >
                      {isDeleting && deleteLoading === room._id ? (
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
                      onClick={() => handleModalChange(room._id)}
                    >
                      <MdModeEdit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  {t("no_data")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
