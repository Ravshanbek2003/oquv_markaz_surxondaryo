import { Controller, useForm } from "react-hook-form";
import { FormValue, Props } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSmsValidations } from "@/validations";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import {
  useAddSnippetMutation,
  useLazyGetSnippetQuery,
  useUpdateSnippetMutation,
} from "@/app/api";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const SmsForm = ({ onClose, templateId }: Props) => {
  const { smsValidation } = useSmsValidations();
  const { t } = useTranslation("", {
    keyPrefix: "settings.office.add_sms_template.form",
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: yupResolver(smsValidation),
    defaultValues: {
      template_text: "",
    },
  });
  const [addSnippet, { isLoading: isAdding }] = useAddSnippetMutation();
  const [updateSnippet, { isLoading: isUpdating }] = useUpdateSnippetMutation();
  const [getSnippet, { data: snippet }] = useLazyGetSnippetQuery();
  const handleRequest = useHandleRequest();

  const onSubmit = async (formValues: FormValue) => {
    await handleRequest({
      request: async () => {
        if (templateId) {
          const result = await updateSnippet({
            id: templateId,
            body: { title: formValues.template_text },
          }).unwrap();
          return result;
        }
        const result = await addSnippet({
          title: formValues.template_text,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(templateId ? t("toast.title_1") : t("toast.title_2"));
      },
    });
  };

  useEffect(() => {
    if (templateId && getSnippet) {
      getSnippet({ id: templateId });
    }
  }, [templateId]);

  useEffect(() => {
    if (snippet) {
      setValue("template_text", snippet.title);
    }
  }, [snippet, setValue]);

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
          name="template_text"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("template_name")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.template_text}
              helperText={errors.template_text?.message}
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
          ) : templateId ? (
            t("button.title_1")
          ) : (
            t("button.title_2")
          )}
        </Button>
      </Box>
    </form>
  );
};
