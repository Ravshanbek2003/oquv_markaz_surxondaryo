import { BoldTabs, Loader } from "@/components";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import {
  AddGroup,
  AddModal,
  AddPayment,
  Comment,
  Groups,
  History,
  SendModal,
} from "./_components";
import { AddModal as EditStudentModal } from "../Students/_components";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import {
  useGetStudentQuery,
  useMeQuery,
  useUpdateStudentMutation,
} from "@/app/api";
import { GetStudentResponse } from "@/app/api/studentApi/types";
import { IoArchive } from "react-icons/io5";
import { useHandleRequest } from "@/hooks";
import { Role, Status } from "@/constants";
import toast from "react-hot-toast";
import { formatUzbekPhoneNumber } from "@/utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export const Student: React.FC = () => {
  const { t } = useTranslation("", { keyPrefix: "students.student" });
  const branch = useSelector(
    (state: { branch?: { branch?: string } }) => state?.branch?.branch
  );
  const [isAllowed, setIsAllowed] = useState(true);

  const { data: userPermissions } = useMeQuery("");
  useEffect(() => {
    setIsAllowed(
      !!userPermissions?.permissions?.find(
        (item) => item.branch === branch && item.name === "PAYMENTS"
      ) || userPermissions?.role !== Role.ADMIN
    );
  }, [branch, userPermissions]);

  const { id } = useParams();
  const { data: user, isLoading } = useGetStudentQuery({ id: id as string });
  const [archiveStudent, { isLoading: isArchiving }] =
    useUpdateStudentMutation();

  const [openModal, setOpenModal] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [payment, setPayment] = useState(false);
  const [addGroupModal, setAddGroupModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleRequest = useHandleRequest();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const onArchive = async () => {
    await handleRequest({
      request: async () => {
        const result = await archiveStudent({
          id: user?._id as string,
          body: {
            status: Status.INACTIVE,
          },
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        toast.success(`${t("toast.title_1")}`);
        navigate("/students");
      },
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isLoading) {
    return <Loader sx={{ height: "70vh", backgroundColor: "transparent" }} />;
  }

  return (
    <Box
      sx={{
        padding: {
          xs: "0px",
          md: "10px",
          lg: "40px",
        },
      }}
    >
      <Card
        sx={{
          width: {
            xs: "100%",
            sm: 480,
          },
          borderRadius: 3,
          mb: 5,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              borderWidth: "2px",
              borderColor: "primary.main",
              borderStyle: "solid",
              borderRadius: "50%",
              padding: "2px",
              width: "86.5px",
              height: "86.5px",
            }}
          >
            <Avatar
              sx={{
                width: "80px",
                height: "80px",
                fontSize: 35,
                fontWeight: 700,
                bgcolor: "primary.main",
                textTransform: "uppercase",
              }}
            >
              {user?.fullName?.match(/\b\w/g)?.slice(0, 1).join("")}
            </Avatar>
          </Box>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <BsThreeDotsVertical
              color="primary"
              style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: 25 }}
            />
          </IconButton>
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: -1,
          }}
        >
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: "bold",
              color: "primary.dark",
              textTransform: "capitalize",
            }}
          >
            {user?.fullName}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "primary.main" }}>
            {t("card.name")}
          </Typography>
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: -3,
          }}
        >
          <Typography sx={{ fontSize: 18 }}>
            {formatUzbekPhoneNumber(user?.phoneNumber as string)}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "primary.main" }}>
            {t("card.phone_number")}
          </Typography>
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: -3,
          }}
        >
          <Typography sx={{ fontSize: 18 }}>{user?.branch?.title}</Typography>
          <Typography sx={{ fontSize: 14, color: "primary.main" }}>
            {t("card.branch")}
          </Typography>
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: -3,
          }}
        >
          <Typography sx={{ fontSize: 18 }}>
            {new Date(user?.createdAt ?? "").toLocaleDateString("ru-RU")}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "primary.main" }}>
            {t("card.added_at")}
          </Typography>
        </CardContent>

        <Divider
          variant="middle"
          sx={{
            borderBottomWidth: 2,
            borderColor: "primary.main",
            mb: 1,
          }}
        />

        <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            disabled={!isAllowed}
            startIcon={<GoPlus />}
            variant="outlined"
            color="primary"
            onClick={() => setPayment(true)}
            sx={{
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              px: 3,
            }}
          >
            {t("card.buttons.add_payment")}
          </Button>
          <Button
            startIcon={<GoPlus />}
            variant="outlined"
            color="primary"
            onClick={() => setAddGroupModal(true)}
            sx={{
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              px: 3,
            }}
          >
            {t("card.buttons.add_to_group")}
          </Button>
        </CardContent>
      </Card>
      <Stack direction="row" sx={{ pb: 10 }} justifyContent={"space-between"}>
        <BoldTabs
          tabs={[
            {
              label: t("bold_tabs.groups"),
              children: <Groups user={user as GetStudentResponse} />,
              value: "Groups",
            },
            {
              label: t("bold_tabs.comment"),
              children: <Comment studentId={user?._id as string} />,
              value: "Comment",
              leftSideContent: (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      sm: "flex-end",
                    },
                  }}
                >
                  <Button
                    startIcon={<GoPlus />}
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenModal(true)}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "auto",
                      },
                      boxShadow: "none",
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                      padding: {
                        xs: "4px 24px",
                        sm: "10px 24px",
                        md: "11px 16px",
                        lg: "11px 24px",
                      },
                    }}
                  >
                    {t("bold_tabs.button")}
                  </Button>
                </Box>
              ),
            },
            // ======== DON'T DELETE THIS COMMENT ==========
            // {
            //   label: "SMS",
            //   children: <Sms />,
            //   value: "SMS",
            //   leftSideContent: (
            //     <Button
            //       startIcon={<GoPlus />}
            //       variant="contained"
            //       color="primary"
            //       onClick={() => setSendModal(true)}
            //       sx={{
            //         boxShadow: "none",
            //         textTransform: "capitalize",
            //         whiteSpace: "nowrap",
            //         padding: "12px 24px",
            //       }}
            //     >
            //       Send a new message
            //     </Button>
            //   ),
            // },
            {
              label: t("bold_tabs.history"),
              children: <History userId={user?._id as string} />,
              value: "History",
            },
          ]}
        />
      </Stack>
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
          onClick={() => setEditModal(true)}
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
            color: "gray",
          }}
          onClick={onArchive}
        >
          <span>
            {isArchiving ? (
              <CircularProgress sx={{ color: "gray" }} size={"1rem"} />
            ) : (
              <IoArchive size={18} />
            )}
          </span>
          {t("menu.archive")}
        </MenuItem>
      </Menu>

      <AddModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        studentId={user?._id as string}
      />

      <AddGroup
        open={addGroupModal}
        onClose={() => setAddGroupModal(false)}
        studentId={user?._id as string}
        groups={user?.groups?.map((group) => group?.group?._id) ?? []}
      />
      <EditStudentModal
        open={editModal}
        onClose={() => setEditModal(false)}
        studentId={user?._id}
      />

      <SendModal open={sendModal} onClose={() => setSendModal(false)} />
      <AddPayment
        userId={user?._id as string}
        open={payment}
        onClose={() => setPayment(false)}
        groups={user?.groups?.map((group) => group?.group?._id) || []}
      />
    </Box>
  );
};
