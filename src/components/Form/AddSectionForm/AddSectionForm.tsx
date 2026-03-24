import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { AddSectionFormValue, useAddSectionValidation } from "@/validations";
import { Props } from "./types";
import {
  useAddSectionMutation,
  useLazyGetSectionQuery,
  useUpdateSectionMutation,
} from "@/app/api";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const AddSectionForm = ({ id, onClose }: Props) => {
  const addSectionValidation = useAddSectionValidation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddSectionFormValue>({
    resolver: yupResolver(addSectionValidation),
    defaultValues: {
      section_name: "",
    },
  });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const [addSection, { isLoading: isAdding }] = useAddSectionMutation();
  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();
  const [getSection, { data: section }] = useLazyGetSectionQuery();
  const handleRequest = useHandleRequest();

  const { t } = useTranslation("", {
    keyPrefix: "leads.card.add_section.form",
  });

  const onSubmit = async (formValues: AddSectionFormValue) => {
    await handleRequest({
      request: async () => {
        if (id) {
          const result = await updateSection({
            id,
            title: formValues.section_name,
          }).unwrap();
          return result;
        }

        const result = await addSection({
          branch,
          title: formValues.section_name,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(id ? `${t("toast.title_1")}` : `${t("toast.title_2")}`);
      },
    });
  };

  useEffect(() => {
    if (id && getSection) {
      getSection({ id });
    }
  }, [id]);

  useEffect(() => {
    if (section) {
      setValue("section_name", section.title);
    }
  }, [section, setValue]);

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
          name="section_name"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("section_name")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.section_name}
              helperText={errors.section_name?.message}
            />
          )}
        />
        <Button
          disabled={isAdding || isUpdating}
          autoFocus
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isAdding || isUpdating ? (
            <CircularProgress sx={{ color: "white" }} size={"1.5rem"} />
          ) : id ? (
            `${t("update_section")}`
          ) : (
            `${t("create_section")}`
          )}
        </Button>
      </Box>
    </form>
  );
};
