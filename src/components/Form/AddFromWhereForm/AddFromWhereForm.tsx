import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import {
  AddFromWhereFormValue,
  useAddFromWhereValidation,
} from "@/validations";
import { Props } from "./types";
import {
  useAddSourceMutation,
  useLazyGetSourceQuery,
  useUpdateSourceMutation,
} from "@/app/api";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const AddFromWhereForm = ({ onClose, id }: Props) => {
  const addFromWhereValidation = useAddFromWhereValidation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddFromWhereFormValue>({
    resolver: yupResolver(addFromWhereValidation),
    defaultValues: {
      name: "",
    },
  });

  const [addSource, { isLoading: isAdding }] = useAddSourceMutation();
  const [updateSource, { isLoading: isUpdating }] = useUpdateSourceMutation();
  const [getSource, { data: source }] = useLazyGetSourceQuery();
  const handleRequest = useHandleRequest();

  const { t } = useTranslation("", {
    keyPrefix: "leads.card.add_from_where.form",
  });

  const onSubmit = async (formValues: AddFromWhereFormValue) => {
    await handleRequest({
      request: async () => {
        if (id) {
          const result = await updateSource({
            id,
            title: formValues.name,
          }).unwrap();
          return result;
        }

        const result = await addSource({
          title: formValues.name,
        });
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(id ? `${t("toast.title_1")}` : `${t("toast.title_2")}`);
      },
    });
  };

  useEffect(() => {
    if (id && getSource) {
      getSource({ id });
    }
  }, [id]);

  useEffect(() => {
    if (source) {
      setValue("name", source.title);
    }
  }, [setValue, source]);

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
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("from_where_name")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.name}
              helperText={errors.name?.message}
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
            `${t("update_from")}`
          ) : (
            `${t("create_from")}`
          )}
        </Button>
      </Box>
    </form>
  );
};
