/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDeleteGroupMutation,
  useGetAllGroupsQuery,
  useUpdateGroupMutation,
} from "@/app/api";
import { Alert, Loader } from "@/components";
import { Status } from "@/constants";
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
import { useTranslation } from "react-i18next";
import { IoMdTrash } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import { useSelector } from "react-redux";

export const GroupsArchive = () => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.archive.groups_tabs",
  });
  const { branch } = useSelector((state: any) => state.branch);
  const [activateGroup, { isLoading: isActivating }] = useUpdateGroupMutation();
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();
  const { data: { groups } = {}, isLoading: isGetting } = useGetAllGroupsQuery({
    branch,
    status: Status.INACTIVE,
  });

  const [isDeleteGroup, setIsDeleteGroup] = useState<{
    id: string;
    open: boolean;
  }>({ id: "", open: false });
  const [isLoading, setIsLoading] = useState("");
  const handleRequest = useHandleRequest();

  const onActivate = async (id: string) => {
    setIsLoading(id);
    await handleRequest({
      request: async () => {
        const result = await activateGroup({
          id,
          body: { status: Status.ACTIVE },
        }).unwrap();
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
        const result = await deleteGroup({ id }).unwrap();
        return result;
      },
      onSuccess: () => {
        setIsDeleteGroup({ id: "", open: false });
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
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("group_name")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("course")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("teacher")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("start_date")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("end_date")}
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
            {groups && groups.length ? (
              groups.map((group, index) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="justify">{index + 1}</TableCell>
                  <TableCell align="justify" component="th" scope="row">
                    {group.name}
                  </TableCell>
                  <TableCell align="justify">
                    {group?.course?.title || "No data"}
                  </TableCell>
                  <TableCell align="justify">
                    {group?.teacher?.fullName || "No data"}
                  </TableCell>
                  <TableCell align="justify">{group.startDate}</TableCell>
                  <TableCell align="justify">{group.endDate}</TableCell>
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
                      onClick={() => onActivate(group._id)}
                    >
                      {isActivating && isLoading === group._id ? (
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
                        setIsDeleteGroup({ id: group._id, open: true })
                      }
                    >
                      <IoMdTrash size={20} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={6}>
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
        open={isDeleteGroup.open}
        onClose={() => setIsDeleteGroup({ id: "", open: false })}
        onClick={() => onDelete(isDeleteGroup.id)}
        isLoading={isDeleting}
      />
    </>
  );
};
