/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllStaffsQuery, useUpdateStaffMutation } from "@/app/api";
import { Alert, Loader } from "@/components";
import { Role, Status } from "@/constants";
import { useHandleRequest } from "@/hooks";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoArchive, IoChatbubbleOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { Props } from "./types";
import toast from "react-hot-toast";
import { formatUzbekPhoneNumber } from "@/utils";
import { useTranslation } from "react-i18next";

export function Admins({ onModalChange, setSelectedAdmin }: Props) {
  const { t } = useTranslation("", { keyPrefix: "settings.ceo.admins" });
  const { branch } = useSelector((state: any) => state.branch);
  const {
    data: { staff } = {},
    isLoading: isGettingAllStaffs,
    isFetching,
  } = useGetAllStaffsQuery({
    branchId: branch,
    role: Role.ADMIN,
  });
  const [archiveAdmin, { isLoading: isArchiving }] = useUpdateStaffMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [adminId, setAdminId] = useState("");
  const handleRequest = useHandleRequest();

  const onArchive = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await archiveAdmin({
          id,
          body: { status: Status.INACTIVE },
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        setOpenAlert(false);
        toast.success(`${t("toast")}`);
      },
    });
  };

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setAdminId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isGettingAllStaffs || isFetching) {
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
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("full_name")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("phone_number")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("telegram")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("role")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="center"
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ width: "100%" }}>
            {staff && staff.length ? (
              staff.map((staff, index) => (
                <TableRow
                  key={staff._id}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell className="flex" component="th" scope="row">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={staff.avatar}
                        sx={{ bgcolor: "primary.main" }}
                      >
                        {staff.fullName.charAt(0)}
                      </Avatar>
                      {staff.fullName}
                    </div>
                  </TableCell>
                  <TableCell align="justify" sx={{ minWidth: "180px" }}>
                    {formatUzbekPhoneNumber(staff.phoneNumber)}
                  </TableCell>
                  <TableCell align="justify">
                    {staff.telegram.length > 0 ? (
                      <a
                        href={`https://t.me/${staff.telegram.replace(
                          /^@/,
                          ""
                        )}`}
                        target="_blank"
                      >
                        {staff.telegram.startsWith("@")
                          ? staff.telegram
                          : `@${staff.telegram}`}
                      </a>
                    ) : (
                      t("no_available")
                    )}
                  </TableCell>
                  <TableCell align="justify">{staff.role}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(event) => handleClick(event, staff._id)}
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
                <TableCell align="center" colSpan={5}>
                  {t("no_data")}
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
        onClick={handleClose}
        sx={{ marginLeft: "-50px" }}
      >
        <MenuItem
          onClick={() => {
            setSelectedAdmin(adminId);
            onModalChange();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "orange",
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
            <IoChatbubbleOutline />
          </span>
          {t("menu.sms")}
        </MenuItem>
        <MenuItem
          onClick={() => setOpenAlert(true)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "gray",
          }}
        >
          <span>
            <IoArchive size={18} />
          </span>
          {t("menu.archive")}
        </MenuItem>
      </Menu>
      <Alert
        open={openAlert}
        title={t("alert.title")}
        text={t("alert.message")}
        buttonText={t("alert.btn_text")}
        onClose={() => setOpenAlert(false)}
        onClick={() => onArchive(adminId)}
        isLoading={isArchiving}
      />
    </>
  );
}
