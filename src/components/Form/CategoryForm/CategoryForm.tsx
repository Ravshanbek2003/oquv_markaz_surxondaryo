import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CategoryValidationType, useCategoryValidation } from "@/validations";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useHandleRequest } from "@/hooks";
import {
  useAddCategoryMutation,
  useLazyGetCategoryQuery,
  useUpdateCategoryMutation,
} from "@/app/api";
import toast from "react-hot-toast";
import { Props } from "./types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const CategoryForm = ({ onClose, selectedCategoryId }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "budget.add_modal.form" });
  const categoryValidation = useCategoryValidation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryValidationType>({
    resolver: yupResolver(categoryValidation),
    defaultValues: {
      category_name: "",
    },
  });

  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [getCategory, { data: category }] = useLazyGetCategoryQuery();
  const handleRequest = useHandleRequest();

  const onSubmit = async (formValues: CategoryValidationType) => {
    await handleRequest({
      request: async () => {
        if (selectedCategoryId) {
          const result = await updateCategory({
            id: selectedCategoryId,
            body: { title: formValues.category_name },
          }).unwrap();
          return result;
        }
        const result = await addCategory({
          title: formValues.category_name,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        toast.success(
          selectedCategoryId ? t("toast.title_1") : t("toast.title_2")
        );
        onClose();
      },
    });
  };

  useEffect(() => {
    if (selectedCategoryId && getCategory) {
      getCategory({ id: selectedCategoryId });
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (category) {
      setValue("category_name", category.title);
    }
  }, [category, setValue]);

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
          name="category_name"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("category_name")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.category_name}
              helperText={errors.category_name?.message}
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
            <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
          ) : selectedCategoryId ? (
            t("button.title_1")
          ) : (
            t("button.title_2")
          )}
        </Button>
      </Box>
    </form>
  );
};
