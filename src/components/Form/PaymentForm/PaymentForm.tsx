/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  PaymentValidationType,
  usePaymentValidation,
} from "@/validations/Payment";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { SingleSelect } from "@/components/SingleSelect";
import { DatePicker } from "@/components/DatePicker";
import dayjs from "dayjs";
import { useAddPaymentMutation, useGetAllGroupsQuery } from "@/app/api";
import { useSelector } from "react-redux";
import { PaymentMethod } from "@/constants";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { Props } from "./type";
import { formatAmountForm, resetAmountForm } from "@/utils";
import { useTranslation } from "react-i18next";

export const PaymentForm = ({ onClose, userId, studentGroups }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "students.student.add_payment.form",
  });
  const paymentValidation = usePaymentValidation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentValidationType>({
    resolver: yupResolver(paymentValidation),
    defaultValues: {
      group: "",
      method: "",
      amount: "",
      date: "",
      comment_text: "",
    },
  });
  const { branch } = useSelector((state: any) => state.branch);
  const { data: { groups } = {} } = useGetAllGroupsQuery({ branch });
  const [addPayment, { isLoading: isAdding }] = useAddPaymentMutation();

  const handleRequest = useHandleRequest();

  const onSubmit = async (formValues: PaymentValidationType) => {
    await handleRequest({
      request: async () => {
        const result = await addPayment({
          group: formValues.group,
          amount: Number(formValues.amount),
          method: (formValues.method as PaymentMethod) || "",
          date: dayjs(formValues.date).format("YYYY-MM-DD"),
          comment: formValues.comment_text || "",
          student: userId,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(`${t("toast")}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          name="group"
          control={control}
          render={({ field }) => (
            <SingleSelect
              options={
                groups
                  ?.filter((group) => studentGroups.includes(group._id))
                  ?.map((group) => ({
                    label: group.name,
                    value: group._id,
                  })) || []
              }
              label={t("select_group")}
              onChange={field.onChange}
              error={!!errors.group}
              helperText={errors.group?.message}
            />
          )}
        />
        <Controller
          name="method"
          control={control}
          render={({ field }) => (
            <SingleSelect
              options={Object.values(PaymentMethod)?.map((item) => ({
                label: item,
                value: item,
              }))}
              label={t("payment_method")}
              onChange={field.onChange}
              error={!!errors.method}
              helperText={errors.method?.message}
            />
          )}
        />
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("amount")}
              variant="outlined"
              fullWidth
              type="text"
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                const cleanedValue = resetAmountForm(input.value);
                const formattedValue = formatAmountForm(cleanedValue);
                field.onChange(cleanedValue);
                input.value = formattedValue;
              }}
              value={formatAmountForm(field.value as string)}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          )}
        />
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label={t("data_from")}
              onChange={(item) =>
                field.onChange(dayjs(item).format("YYYY-MM-DD"))
              }
              value={dayjs(field.value)}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          )}
        />
        <Controller
          name="comment_text"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("enter_comment")}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              onChange={field.onChange}
              value={field.value}
              error={!!errors.comment_text}
              helperText={errors.comment_text?.message}
            />
          )}
        />
        <Button
          disabled={isAdding}
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isAdding ? (
            <CircularProgress sx={{ color: "white" }} size={"1.5rem"} />
          ) : (
            t("button")
          )}
        </Button>
      </Box>
    </form>
  );
};
