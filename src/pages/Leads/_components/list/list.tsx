/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLazyGetAllLeadsQuery, useUpdateLeadMutation } from "@/app/api";
import { Loader, SingleSelect } from "@/components";
import { pageOptions, Status } from "@/constants";
import { useHandleRequest } from "@/hooks";
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
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
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { IoArchive } from "react-icons/io5";
import { LuMessageCircle } from "react-icons/lu";
import { MdModeEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { AddLead as EditLead } from "../modals";
import { Props } from "./types";
import { AddGroup } from "@/pages/Student/_components";
import { formatUzbekPhoneNumber } from "@/utils";
import { useTranslation } from "react-i18next";

export const List = ({ debouncedValue, filters }: Props) => {
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const [
    getAllLeads,
    {
      data: { leads, count, total, page, perPage } = {},
      isLoading: isGetting,
      isFetching,
    },
  ] = useLazyGetAllLeadsQuery();
  const [archiveLead, { isLoading: isArchiving }] = useUpdateLeadMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [leadId, setLeadId] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [pagination, setPagination] = useState<{
    page?: number;
    perPage?: number;
  }>({ page: 1, perPage: 10 });
  const handleRequest = useHandleRequest();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setLeadId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { t } = useTranslation("", { keyPrefix: "leads.list" });

  const onArchive = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await archiveLead({
          id,
          body: { status: Status.INACTIVE },
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        handleClose();
        toast.success(`${t("toast")}`);
      },
    });
  };

  useEffect(() => {
    if (branch && getAllLeads) {
      getAllLeads({
        branch,
        section: filters.sections.join(","),
        source: filters.fromWhere.join(","),
        search: debouncedValue,
        status: Status.ACTIVE,
        page: pagination.page,
        perPage: pagination.perPage,
      });
    }
  }, [
    branch,
    debouncedValue,
    filters.fromWhere,
    filters.sections,
    getAllLeads,
    pagination.page,
    pagination.perPage,
  ]);

  if (isGetting || isFetching) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
  }

  return (
    <>
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
                {t("lead_name")}
              </TableCell>
              <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                {t("phone_number")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                {t("from_where")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                {t("section")}
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              ></TableCell>
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
                  <TableCell>{lead.fullName}</TableCell>
                  <TableCell sx={{ minWidth: "180px" }}>
                    {formatUzbekPhoneNumber(lead.phoneNumber)}
                  </TableCell>
                  <TableCell align="center">
                    {lead?.source?.title || "No data"}
                  </TableCell>
                  <TableCell align="center">
                    {lead?.section?.title || "No data"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(event) => handleClick(event, lead._id)}
                      size="small"
                      aria-haspopup="true"
                      sx={{ ml: 2 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-expanded={open ? "true" : undefined}
                    >
                      <BsThreeDotsVertical className="cursor-pointer" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t("no_date_available")}
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
            setEditModal(true);
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
            color: "green",
          }}
        >
          <span>
            <LuMessageCircle size={17} />
          </span>
          {t("menu.sms")}
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "gray",
          }}
          onClick={() => onArchive(leadId)}
        >
          <span>
            {isArchiving ? (
              <CircularProgress color="inherit" size={"1rem"} />
            ) : (
              <IoArchive size={18} />
            )}
          </span>
          {t("menu.archive")}
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onClick={() => {
            setOpenGroup(true);
            handleClose();
          }}
        >
          <span>
            <IoIosAdd size={20} />
          </span>
          {t("menu.add_to_group")}
        </MenuItem>
      </Menu>

      <EditLead
        id={leadId}
        open={editModal}
        onClose={() => setEditModal(false)}
      />
      <AddGroup
        open={openGroup}
        onClose={() => setOpenGroup(false)}
        studentId={leadId}
        groups={[]}
        isLead
      />
    </>
  );
};
