import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useState, MouseEvent } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuMessageCircle } from "react-icons/lu";
import { MdModeEdit } from "react-icons/md";
import { AddModal } from "../add-modal";
import { useHandleRequest } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useGetStaffQuery, useUpdateStaffMutation } from "@/app/api";
import { Status } from "@/constants";
import { MdOutlineArchive } from "react-icons/md";
import toast from "react-hot-toast";
import { formatAmount, formatUzbekPhoneNumber } from "@/utils";
import { useTranslation } from "react-i18next";

export const Profile = () => {
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const handleRequest = useHandleRequest();

  const { t } = useTranslation("", { keyPrefix: "teachers.tabs.profile" });

  const { data: staff, isLoading } = useGetStaffQuery({
    id: id ?? "",
  });

  const [archiveStaff, { isLoading: isArchiving }] = useUpdateStaffMutation();

  const navigate = useNavigate();
  const onDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await archiveStaff({
          id,
          body: { status: Status.INACTIVE },
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        toast.success("Teacher was successfully archived");
        navigate(`/teachers`);
      },
    });
  };
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {!isLoading ? (
        <>
          <Card
            color="primary"
            component="h2"
            sx={{
              mb: 3,
              maxWidth: "400px",
              padding: "6px",
              borderRadius: "10px",
            }}
          >
            <CardContent
              sx={{
                bgcolor: "primary.main",
                borderRadius: "8px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: "85px",
                  height: "85px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "primary.main",
                  color: "white",
                  border: "3px solid white",
                  position: "absolute",
                  bottom: "-25px",
                }}
              >
                {!staff?.avatar ? (
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    {staff?.fullName.charAt(0)}
                  </Typography>
                ) : (
                  <Avatar
                    sx={{
                      backgroundColor: "primary.main",
                      width: "100%",
                      height: "100%",
                    }}
                    src={staff?.avatar}
                  >
                    {staff?.fullName.charAt(0)}
                  </Avatar>
                )}
              </Box>
              <IconButton
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 5,
                }}
              >
                <BsThreeDotsVertical color="white" fontSize={24} />
              </IconButton>
            </CardContent>
            <CardContent sx={{ marginBottom: "-40px" }}>
              <Typography
                color="primary"
                sx={{
                  marginTop: "20px",
                  fontWeight: "600",
                  fontSize: "20px",
                  textTransform: "capitalize",
                }}
              >
                {staff?.fullName}
              </Typography>
              <div className="flex justify-between mt-2 mb-3 text-black">
                <Stack direction={"row"} columnGap={2}>
                  <Chip
                    size="small"
                    color="primary"
                    variant="filled"
                    sx={{ borderRadius: "4px" }}
                    label={staff?.role}
                  />
                </Stack>
              </div>

              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginLeft: "-15px",
                  marginTop: "-10px",
                }}
              >
                <Typography variant="body2" color="textPrimary">
                  {t("branch")}:
                </Typography>
                <div>
                  {staff?.branches?.map((el, index) => (
                    <Typography
                      key={el._id}
                      color="primary"
                      sx={{ fontWeight: "500", textAlign: "end" }}
                      variant="body2"
                    >
                      {el.title}
                      {`${index === staff?.branches?.length - 1 ? "" : ","}`}
                    </Typography>
                  ))}
                </div>
              </CardContent>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginLeft: "-15px",
                  marginTop: "-20px",
                }}
              >
                <Typography variant="body2" color="textPrimary">
                  {t("phone")}:
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: "500" }}
                >
                  {formatUzbekPhoneNumber(staff?.phoneNumber as string)}
                </Typography>
              </CardContent>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginLeft: "-15px",
                  marginTop: "-20px",
                }}
              >
                <Typography variant="body2" color="textPrimary">
                  {t("telegram")}:
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: "500" }}
                >
                  {staff?.telegram ? (
                    <a
                      href={`https://t.me/${staff?.telegram.replace("@", "")}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {staff?.telegram.startsWith("@")
                        ? staff?.telegram
                        : `@${staff?.telegram}`}
                    </a>
                  ) : (
                    `${t("no_data")}`
                  )}
                </Typography>
              </CardContent>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginLeft: "-15px",
                  marginTop: "-20px",
                }}
              >
                <Typography variant="body2" color="textPrimary">
                  {t("percent")}:
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: "500" }}
                >
                  {(staff?.percent ? staff?.percent : "0") + "%" || "0%"}
                </Typography>
              </CardContent>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginLeft: "-15px",
                  marginTop: "-20px",
                }}
              >
                <Typography variant="body2" color="textPrimary">
                  {t("balance")}:
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    fontWeight: "500",
                    color: String(staff?.balance).startsWith("-") ? "red" : "",
                  }}
                >
                  {formatAmount(staff?.balance || 0) || "0"} UZS
                </Typography>
              </CardContent>
            </CardContent>
          </Card>
          <Menu
            id="fade-menu"
            MenuListProps={{ "aria-labelledby": "fade-button" }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              sx={{ color: "orange" }}
              onClick={() => {
                setOpenModal(true);
                handleClose();
              }}
            >
              <MdModeEdit size={18} className="mr-2" />
              {t("menu.edit")}
            </MenuItem>
            <MenuItem sx={{ color: "green" }}>
              <LuMessageCircle className="mr-2" /> {t("menu.sms")}
            </MenuItem>
            <MenuItem
              onClick={() => onDelete(staff?._id as string)}
              sx={{ color: "gray" }}
            >
              {isArchiving ? (
                <CircularProgress
                  sx={{ color: "gray", marginRight: "8px" }}
                  size={"1rem"}
                />
              ) : (
                <MdOutlineArchive size={20} className="mr-2" />
              )}
              {t("menu.archive")}
            </MenuItem>
          </Menu>
          <AddModal
            open={openModal}
            teacherId={staff?._id}
            onClose={() => setOpenModal(false)}
          />
        </>
      ) : (
        <>
          <Skeleton variant="rounded" width={400} height={207} />
          <br />
          <Skeleton variant="rounded" width={400} height={20} />
          <br />
          <Skeleton variant="rounded" width={400} height={20} />
          <br />
          <Skeleton variant="rounded" width={400} height={20} />
        </>
      )}
    </div>
  );
};
