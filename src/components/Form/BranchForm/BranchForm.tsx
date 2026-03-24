import { Controller, useForm } from "react-hook-form";
import { FormValue, Props } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useBranchValidation } from "@/validations";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useHandleRequest } from "@/hooks";
import {
  useAddBranchMutation,
  useLazyGetBranchQuery,
  useUpdateBranchMutation,
} from "@/app/api";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const BranchForm = ({ id, onClose }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.ceo.add_branch.form",
  });
  const branchValidation = useBranchValidation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValue>({
    resolver: yupResolver(branchValidation),
    defaultValues: {
      branch_name: "",
      status: 1,
    },
  });
  const [addBranch, { isLoading: isAdding }] = useAddBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
  const [getBranch, { data: branch }] = useLazyGetBranchQuery();
  const handleRequest = useHandleRequest();

  const onSubmit = (formValues: FormValue) => {
    handleRequest({
      request: async () => {
        if (id) {
          const result = await updateBranch({
            id,
            body: { title: formValues.branch_name },
          }).unwrap();
          return result;
        }

        const result = await addBranch({
          title: formValues.branch_name,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        toast.success(id ? t("toast.title_1") : t("toast.title_2"));
        onClose();
      },
    });
  };

  useEffect(() => {
    if (id && getBranch) {
      getBranch({ id });
    }
  }, [id]);

  useEffect(() => {
    if (branch) {
      setValue("branch_name", branch.title);
      setValue("status", branch.status);
    }
  }, [branch, setValue]);

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
          name="branch_name"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("branch_name")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.branch_name}
              helperText={errors.branch_name?.message}
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
          ) : id ? (
            t("button.title_1")
          ) : (
            t("button.title_2")
          )}
        </Button>
      </Box>
    </form>
  );
};
