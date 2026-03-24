import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SendSmsType, useSmsValidations } from "@/validations";
import { Box, Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

export const SendForm = () => {
  const { sendSmsValidation } = useSmsValidations();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SendSmsType>({
    resolver: yupResolver(sendSmsValidation),
  });

  const onSubmit = (formValues: SendSmsType) => {
    console.warn(formValues);
  };

  const { t } = useTranslation("", {
    keyPrefix: "students.student.send_modal.form",
  });

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
          name="sms_text"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("enter_massage")}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              onChange={field.onChange}
              value={field.value}
              error={!!errors.sms_text}
              helperText={errors.sms_text?.message}
            />
          )}
        />
        <Button variant="contained" type="submit" sx={{ py: 1 }}>
          {t("button")}
        </Button>
      </Box>
    </form>
  );
};
