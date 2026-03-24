import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import {
  profileValidation,
  profileValidationType,
} from "@/validations/Profile";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { FileUploader } from "@/components/FileUploader";
import { useEditMutation, useMeQuery, useUploadImageMutation } from "@/app/api";
import { useEffect, useState } from "react";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const EditForm = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation("", { keyPrefix: "profile.edit_modal" });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<profileValidationType>({
    resolver: yupResolver(profileValidation),
    defaultValues: {
      avatar: "",
      fullName: "",
      telegram: "",
      newPassword: "",
      oldPassword: "",
    },
  });

  const { data: user } = useMeQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useEditMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  const handleRequest = useHandleRequest();

  const onSubmit = async (formValues: profileValidationType) => {
    await handleRequest({
      request: async () => {
        let userImage = formValues.avatar;
        const formData = new FormData();
        if (selectedImage) {
          formData.append("file", selectedImage);
          const { url } = await uploadImage(formData).unwrap();
          userImage = url;
        }
        const result = await updateProfile({
          avatar: userImage as string,
          fullName: formValues.fullName as string,
          telegram: formValues.telegram as string,
          newPassword: formValues.newPassword || undefined,
          oldPassword: formValues.oldPassword || undefined,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(t("toast"));
      },
    });
  };

  useEffect(() => {
    if (user) {
      setValue("fullName", user.fullName);
      setValue("avatar", user.avatar);
      setValue("telegram", user.telegram);
    }
  }, [user, setValue]);

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
          name="fullName"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("full_name")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          )}
        />
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <FileUploader
              fullWidth
              value={field?.value}
              onChange={(file) => setSelectedImage(file)}
              buttonSx={{ py: 1.8 }}
              isShowImg={true}
              error={!!errors.avatar}
              helperText={errors.avatar?.message}
            />
          )}
        />
        <Controller
          name="telegram"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("telegram_username")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.telegram}
              helperText={errors.telegram?.message}
            />
          )}
        />
        <Controller
          name="oldPassword"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("old_password")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword?.message}
            />
          )}
        />
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("new_password")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
          )}
        />
        <Button
          disabled={isUpdating || isUploading}
          autoFocus
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isUpdating || isUploading ? (
            <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
          ) : (
            t("btn_update")
          )}
        </Button>
      </Box>
    </form>
  );
};
