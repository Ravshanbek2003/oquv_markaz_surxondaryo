/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { GoPlus } from "react-icons/go";
import { AddModal } from "./_components";
import {
  useDeleteNotificationMutation,
  useGetAllNotificationsQuery,
  useLazyGetNotificationQuery,
  useMeQuery,
} from "@/app/api";
import { Loader } from "@/components";
import { formatDate } from "@/utils";
import { IoMdTrash } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { Role } from "@/constants";
import { useTranslation } from "react-i18next";

export const Notification = () => {
  const { t } = useTranslation("", { keyPrefix: "notification" });
  const { branch } = useSelector((state: any) => state.branch);
  const [isAllowed, setIsAllowed] = useState(true);

  const { data: user } = useMeQuery("");
  useEffect(() => {
    setIsAllowed(
      user?.role === Role.CEO ||
        !!user?.permissions?.find(
          (item) => item.branch === branch && item.name === "NOTIFICATION"
        )
    );
  }, [branch, user]);

  const { data: { notifications } = {}, isLoading: isGettingAllNotifications } =
    useGetAllNotificationsQuery({
      type: "all",
      id: branch,
    });
  const [getNotification, { data: notification, isFetching }] =
    useLazyGetNotificationQuery();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();
  const [addNewBlog, setAddNewBlog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<{
    id: string;
    update: boolean;
  }>({ id: "", update: false });
  const handleRequest = useHandleRequest();

  const onDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await deleteNotification({ id }).unwrap();
        return result;
      },
      onSuccess: () => {
        setSelectedNotification({ id: "", update: false });
        toast.success(`${t("toast")}`);
      },
    });
  };

  const handleCardClick = (id: string) => {
    setSelectedNotification({ id, update: false });
  };

  const handleClose = () => {
    setTimeout(() => {
      setSelectedNotification({
        id: selectedNotification.id,
        update: false,
      });
    }, 500);
    setAddNewBlog(false);
  };

  useEffect(() => {
    if (branch) {
      setSelectedNotification({ id: "", update: false });
    }
  }, [branch]);

  useEffect(() => {
    if (selectedNotification.id && getNotification) {
      getNotification({ id: selectedNotification.id });
    }
  }, [selectedNotification.id]);

  if (isGettingAllNotifications) {
    return <Loader sx={{ height: "70vh", backgroundColor: "transparent" }} />;
  }

  return (
    <>
      <div className="text-end">
        {isAllowed && (
          <Button
            startIcon={<GoPlus />}
            variant="contained"
            color="primary"
            onClick={() => setAddNewBlog(true)}
            sx={{
              boxShadow: "none",
              textTransform: "none",
              whiteSpace: "nowrap",
              padding: {
                xs: "4px 24px",
                sm: "10px 24px",
                md: "11px 24px",
              },
            }}
          >
            {t("new_post")}
          </Button>
        )}
      </div>

      <Box
        sx={{
          display: "flex",
          gap: {
            xs: "4px",
            sm: "6px",
            md: "24px",
          },
          paddingTop: {
            xs: "10px",
            md: "20px",
          },
        }}
      >
        <div className="w-1/3 bg-transparent rounded-lg h-[65vh] overflow-y-auto p-[4px] pl-0 md:p-2 ">
          {notifications && notifications.length ? (
            notifications?.map((item) => (
              <Card
                key={item._id}
                sx={{
                  cursor: "pointer",
                  marginBottom: {
                    xs: "4px",
                    sm: "6px",
                    md: "8px",
                  },
                  border:
                    selectedNotification.id === item._id ? "2px solid" : "",
                  borderColor: "primary.main",
                }}
                onClick={() => handleCardClick(item._id)}
              >
                <CardContent
                  sx={{
                    position: "relative",
                    padding: {
                      xs: "4px 8px",
                      sm: "auto",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{
                      fontSize: { xs: "14px", sm: "16px", md: "20px" },
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <div className="flex justify-between mt-[2px] sm:mt-2">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        fontSize: {
                          xs: "8px",
                          sm: "14px",
                        },
                      }}
                    >
                      {formatDate(new Date(item.createdAt))}
                    </Typography>
                    <div className="flex items-center gap-[1px] sm:gap-1 text-gray-400 absolute right-4 bottom-3">
                      <Visibility
                        fontSize="small"
                        sx={{ fontSize: { xs: "14px", sm: "20px" } }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: {
                            xs: "10px",
                            sm: "14px",
                          },
                        }}
                      >
                        {item.seen > 1000
                          ? ` ${(item.seen / 1000).toFixed(1)}k`
                          : item.seen}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card sx={{ marginBottom: "8px" }}>
              <CardContent sx={{ position: "relative" }}>
                <Typography
                  variant="body1"
                  sx={{ textAlign: "center", color: "primary.main" }}
                >
                  {t("no_data")}
                </Typography>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="w-2/3 bg-white rounded-lg h-[65vh] shadow-md p-2 md:p-4 relative">
          {isFetching ? (
            <Loader sx={{ height: "60vh", backgroundColor: "transparent" }} />
          ) : notification && selectedNotification.id ? (
            <>
              <Typography
                color="primary"
                variant="h5"
                sx={{
                  fontSize: { xs: "14px", sm: "16px", md: "20px" },
                  fontWeight: "bold",
                }}
              >
                {notification.title}
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  height: "85%",
                  overflow: "auto",
                  fontSize: { xs: "12px", sm: "20px" },
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: notification.message || "",
                  }}
                ></div>
              </Typography>
              {isAllowed && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    position: "absolute",
                    bottom: {
                      xs: "10px",
                      md: "20px",
                    },
                    right: {
                      xs: "10px",
                      md: "20px",
                    },
                  }}
                >
                  <Button
                    variant="outlined"
                    color="warning"
                    size="medium"
                    onClick={() => {
                      setSelectedNotification({
                        id: notification._id,
                        update: true,
                      });
                      setAddNewBlog(true);
                    }}
                  >
                    <MdModeEdit size={15} />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="medium"
                    onClick={() => onDelete(notification._id)}
                  >
                    {isDeleting ? (
                      <CircularProgress sx={{ color: "red" }} size={"1rem"} />
                    ) : (
                      <IoMdTrash size={15} />
                    )}
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <Typography variant="h5" color="primary.main">
                {t("no_notification")}
              </Typography>
            </div>
          )}
        </div>
      </Box>

      <AddModal
        notificationID={
          selectedNotification.update ? selectedNotification.id : ""
        }
        open={addNewBlog}
        onClose={handleClose}
      />
    </>
  );
};
