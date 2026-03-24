/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/app/api";
import { useUploadImageMutation } from "@/app/api/uploadApi/uploadApi";
import { Loader } from "@/components";
import { ColorSelect } from "@/components/ColorSelect";
import { useHandleRequest } from "@/hooks";
import { generalForm, generalValidation } from "@/validations/General";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const General = () => {
  const { t } = useTranslation("", { keyPrefix: "settings.general" });
  const {
    control,
    handleSubmit,
    setValue,

    formState: { errors },
  } = useForm<generalForm>({
    resolver: yupResolver(generalValidation),
    defaultValues: {
      about: "",
      color: "",
      name: "",
      logo: "",
    },
  });

  const { data: settings, isLoading } = useGetSettingsQuery("");

  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const handleRequest = useHandleRequest();
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );

  const onSubmit = async (formValues: generalForm) => {
    await handleRequest({
      request: async () => {
        let logo = formValues.logo;
        if (selectedImage) {
          const formData = new FormData();
          formData.append("file", selectedImage);
          const { url } = await uploadImage(formData).unwrap();
          logo = url;
        }
        const result = await updateSettings({
          name: formValues.name,
          about: formValues.about,
          color: formValues.color,
          logo,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        toast.success("Settings updated successfully");
      },
    });
  };

  useEffect(() => {
    if (settings) {
      setValue("name", settings.name || "");
      setValue("about", settings.about || "");
      setValue("logo", settings.logo || "");
      setValue("color", settings.color || "");
    }
  }, [settings]);

  if (isLoading) {
    return <Loader sx={{ height: "70vh", backgroundColor: "transparent" }} />;
  }

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontSize: {
              xs: "20px",
              sm: "24px",
            },
          }}
        >
          {t("title")}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="color"
            control={control}
            render={({ field }) => <ColorSelect onChange={field.onChange} />}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: {
                xs: "10px",
                sm: "30px",
              },
              mt: 4,
              mb: 4,
            }}
          >
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #ccc",
                    borderRadius: "8px",
                    cursor: "pointer",
                    overflow: "hidden",
                    position: "relative",
                    marginBottom: "16px",
                    padding: "8px",
                  }}
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : field.value
                        ? field.value
                        : "/placeholder.png"
                    }
                    alt="Uploaded"
                    style={{
                      width: "450px",
                      height: "260px",
                      objectFit: "cover",
                    }}
                  />
                  <Input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={({ target }: any) => {
                      setSelectedImage(target?.files[0]);
                    }}
                  />
                </Box>
              )}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: {
                  xs: "100%",
                  sm: "55%",
                },
                gap: {
                  xs: 2,
                  sm: 4,
                },
                mb: {
                  xs: 2,
                  sm: 4,
                },
              }}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    label={t("company_name")}
                    variant="outlined"
                    fullWidth
                    onChange={field.onChange}
                    value={field.value}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="about"
                control={control}
                render={({ field }) => (
                  <TextField
                    label={t("about_us")}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    onChange={field.onChange}
                    value={field.value}
                    error={!!errors.about}
                    helperText={errors.about?.message}
                  />
                )}
              />
            </Box>
          </Box>
          <div className="flex justify-end relative right-6 -top-10">
            <Button
              variant="contained"
              type="submit"
              sx={{
                py: 1,
                px: {
                  xs: "0px",
                  sm: "50px",
                },
                width: {
                  xs: "300px",
                  sm: "auto",
                },
              }}
            >
              {isUpdating || isUploading ? (
                <CircularProgress sx={{ color: "white" }} size={"1.5rem"} />
              ) : (
                t("button")
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
