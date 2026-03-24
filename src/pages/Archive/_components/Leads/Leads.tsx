/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDeleteLeadMutation,
  useLazyGetAllLeadsQuery,
  useUpdateLeadMutation,
} from "@/app/api";
import { Alert, Loader, SingleSelect } from "@/components";
import { pageOptions, Status } from "@/constants";
import { useHandleRequest } from "@/hooks";
import { formatUzbekPhoneNumber } from "@/utils";
import {
  CircularProgress,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { IoMdTrash } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import { useSelector } from "react-redux";

export const Leads = () => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.archive.leads_tabs",
  });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const [
    getAllLeads,
    { data: { leads, count, total, page, perPage } = {}, isLoading: isGetting },
  ] = useLazyGetAllLeadsQuery();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  const [activeLead, { isLoading: isActivating }] = useUpdateLeadMutation();
  const [isLoading, setIsLoading] = useState("");
  const [pagination, setPagination] = useState<{
    page?: number;
    perPage?: number;
  }>({
    page: 1,
    perPage: 10,
  });
  const handleRequest = useHandleRequest();

  const [openAlert, setOpenAlert] = useState<{ open: boolean; id: string }>({
    id: "",
    open: false,
  });

  const handleClose = () => {
    setOpenAlert({ open: false, id: "" });
  };

  const onActivate = async (id: string) => {
    setIsLoading(id);
    await handleRequest({
      request: async () => {
        await activeLead({
          id,
          body: { status: Status.ACTIVE },
        });
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
        const result = await deleteLead({ id });
        return result;
      },
      onSuccess: () => {
        handleClose();
        toast.success(t("toast.title_2"));
      },
    });
  };

  useEffect(() => {
    if (branch) {
      getAllLeads({
        branch,
        page: pagination.page,
        perPage: pagination.perPage,
        status: Status.INACTIVE,
      });
    }
  }, [branch, pagination.page, pagination.perPage]);

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
                {t("full_name")}
              </TableCell>
              <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                {t("phone_number")}
              </TableCell>
              <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                {t("section")}
              </TableCell>
              <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                {t("source")}
              </TableCell>
              <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                {t("created_date")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                {t("action")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads && leads.length ? (
              leads.map((lead, index) => (
                <TableRow
                  key={lead._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {(Number(page || 1) - 1) * Number(perPage || 10) +
                      index +
                      1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {lead.fullName}
                  </TableCell>
                  <TableCell sx={{ minWidth: "180px" }}>
                    {formatUzbekPhoneNumber(lead.phoneNumber as string)}
                  </TableCell>
                  <TableCell>{lead?.section?.title || "No data"}</TableCell>
                  <TableCell>{lead?.source?.title || "No data"}</TableCell>
                  <TableCell>
                    {new Date(lead.createdAt).toLocaleString("ru-RU")}
                  </TableCell>
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
                      onClick={() => onActivate(lead._id)}
                    >
                      {isActivating && isLoading === lead._id ? (
                        <CircularProgress
                          sx={{ color: "inherit" }}
                          size={"1rem"}
                        />
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
                      onClick={() => setOpenAlert({ id: lead._id, open: true })}
                    >
                      <IoMdTrash size={20} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {t("no_data")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {total && total > 10 ? (
        <div className="flex items-end justify-center w-full">
          <Pagination
            count={count}
            shape="rounded"
            sx={{ mt: 4 }}
            size="medium"
            color="primary"
            page={pagination.page}
            onChange={(_, page) => setPagination({ page: page, perPage })}
          />
          <SingleSelect
            options={
              pageOptions.map((i) => ({
                value: String(i),
                label: String(i),
              })) || []
            }
            sx={{ maxWidth: "70px" }}
            size="small"
            value={String(pagination.perPage) as any}
            onChange={(e) =>
              setPagination({ perPage: Number(e.target.value), page })
            }
          />
        </div>
      ) : null}

      <Alert
        title={t("alert.title")}
        text={t("alert.message")}
        open={openAlert.open}
        onClose={handleClose}
        onClick={() => onDelete(openAlert.id)}
        isLoading={isDeleting}
      />
    </>
  );
};
