/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { MarkdownEditor } from "@/components/MarkDown";
import { SingleSelect } from "@/components/SingleSelect";
import { BlogValidationType, useBlogValidation } from "@/validations";
import { Props } from "./types";
import {
  useAddNotificationMutation,
  useGetAllStaffsQuery,
  useLazyGetNotificationQuery,
  useUpdateNotificationMutation,
} from "@/app/api";
import { useHandleRequest } from "@/hooks";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const BlogForm = ({ onClose, notificationID }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "notification.add_modal.form",
  });
  const blogValidation = useBlogValidation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BlogValidationType>({
    resolver: yupResolver(blogValidation),
    defaultValues: {
      blog_title: "",
      blog_content: "",
      blog_users: [],
    },
  });
  const [addNotification, { isLoading: isAdding }] =
    useAddNotificationMutation();
  const [updateNotification, { isLoading: isUpdating }] =
    useUpdateNotificationMutation();
  const [getNotification, { data: notification }] =
    useLazyGetNotificationQuery();
  const { branch } = useSelector((state: any) => state.branch);
  const { data: { staff } = {} } = useGetAllStaffsQuery({
    branchId: branch,
  });
  const handleRequest = useHandleRequest();

  const onSubmit = async (data: BlogValidationType) => {
    await handleRequest({
      request: async () => {
        if (notificationID) {
          const result = await updateNotification({
            id: notificationID,
            body: {
              title: data.blog_title,
              message: data.blog_content,
              users: data.blog_users as string[],
            },
          }).unwrap();
          return result;
        }
        const result = await addNotification({
          title: data.blog_title,
          message: data.blog_content,
          branch: branch,
          users: data.blog_users as string[],
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(notificationID ? t("toast.title_1") : t("toast.title_2"));
      },
    });
  };

  useEffect(() => {
    if (notificationID && getNotification) {
      getNotification({ id: notificationID });
    }
  }, [notificationID]);

  useEffect(() => {
    if (notification) {
      setValue("blog_title", notification.title);
      setValue("blog_content", notification.message);
      setValue(
        "blog_users",
        notification?.users?.map((user: any) => user._id)
      );
    }
  }, [notification, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          gap: 2,
        }}
      >
        <Controller
          name="blog_title"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("title")}
              variant="outlined"
              fullWidth
              {...field}
              error={!!errors.blog_title}
              helperText={errors.blog_title?.message}
            />
          )}
        />
        <Controller
          name="blog_users"
          control={control}
          render={({ field }) => (
            <SingleSelect
              forNotification
              label={t("users")}
              options={
                staff?.map((staff) => ({
                  value: staff._id,
                  label: staff.fullName,
                })) || []
              }
              onChange={field.onChange}
              value={field.value as string[]}
              error={!!errors.blog_users}
            />
          )}
        />
        <Controller
          name="blog_content"
          control={control}
          render={({ field }) => (
            <MarkdownEditor
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.blog_content?.message}
            />
          )}
        />
        <Button
          disabled={isAdding || isUpdating}
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isAdding || isUpdating ? (
            <CircularProgress size={"1.5rem"} sx={{ color: "#fff" }} />
          ) : notificationID ? (
            t("button.title_1")
          ) : (
            t("button.title_2")
          )}
        </Button>
      </Box>
    </form>
  );
};
