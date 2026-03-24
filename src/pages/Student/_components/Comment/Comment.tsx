import { useDeleteCommentMutation, useGetAllCommentsQuery } from "@/app/api";
import { Loader } from "@/components";
import { useHandleRequest } from "@/hooks";
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { AddModal as EditCommentModal } from "../add-modal";
import { useTranslation } from "react-i18next";

export function Comment({ studentId }: { studentId: string }) {
  const { t } = useTranslation("", {
    keyPrefix: "students.student.comment_tabs",
  });
  const { data: { comments } = {}, isLoading: isGettingComments } =
    useGetAllCommentsQuery({
      studentId,
    });
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [commentId, setCommentId] = useState("");
  const [editCommentModal, setEditCommentModal] = useState(false);
  const handleRequest = useHandleRequest();
  const open = Boolean(anchorEl);

  const onDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await deleteComment({
          commentId: id,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        toast.success(`${t("toast")}`);
      },
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setCommentId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isGettingComments) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
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
                {t("comment")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {t("creator")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {t("date")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments && comments.length ? (
              comments?.map((comment, index) => (
                <TableRow key={comment._id} sx={{ border: 0 }}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ maxWidth: "500px" }}>
                    <p>{comment?.message}</p>
                  </TableCell>
                  <TableCell align="center">
                    {comment?.user?.fullName}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(comment?.createdAt).toLocaleString("ru-RU")}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(event) => handleClick(event, comment?._id)}
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
                <TableCell colSpan={5} align="center">
                  {t("no_comment")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        id="account-menu"
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
            setEditCommentModal(true);
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
          onClick={() => onDelete(commentId)}
        >
          <span>
            {isDeleting ? (
              <CircularProgress color="inherit" size="1rem" />
            ) : (
              <IoMdTrash size={18} />
            )}
          </span>
          {t("menu.delete")}
        </MenuItem>
      </Menu>
      <EditCommentModal
        commentId={commentId}
        open={editCommentModal}
        onClose={() => setEditCommentModal(false)}
      />
    </>
  );
}
