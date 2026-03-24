/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useAddExpenseMutation,
  useGetAllCategoriesQuery,
  useGetAllStaffsQuery,
  useLazyGetExpenseQuery,
  useUpdateExpenseMutation,
} from "@/app/api";
import { DatePicker } from "@/components/DatePicker";
import { SingleSelect } from "@/components/SingleSelect";
import { PaymentMethod } from "@/constants";
import { useHandleRequest } from "@/hooks";
import { expenseValidationType, useExpenseValidation } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Props } from "./types";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { formatAmountForm, resetAmountForm } from "@/utils";
import { useTranslation } from "react-i18next";

export const ExpenseForm = ({ onClose, selectedExpenseId }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "budget.add_expense.form" });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<expenseValidationType>({
    resolver: yupResolver(useExpenseValidation(selectedExpenseId)),
    defaultValues: {
      amount: "",
      category: "",
      description: "",
      date: "",
      employee: "",
      paymentMethod: "",
    },
  });

  const { branch } = useSelector((state: any) => state.branch);
  const [addExpense, { isLoading: isAdding }] = useAddExpenseMutation();
  const { data: { categories } = {} } = useGetAllCategoriesQuery({});
  const { data: { staff } = {} } = useGetAllStaffsQuery({ branchId: branch });
  const [getExpense, { data: expense }] = useLazyGetExpenseQuery();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const handleRequest = useHandleRequest();

  const onSubmit = async (formValues: expenseValidationType) => {
    await handleRequest({
      request: async () => {
        if (selectedExpenseId) {
          const result = await updateExpense({
            id: selectedExpenseId,
            body: {
              description: formValues.description,
              category: formValues.category,
              date: dayjs(formValues.date).format("YYYY-MM-DD"),
              paymentMethod: formValues.paymentMethod as PaymentMethod,
            },
          }).unwrap();
          return result;
        }

        const result = await addExpense({
          description: formValues.description,
          amount: Number(formValues.amount),
          category: formValues.category,
          employee: formValues.employee as string,
          date: dayjs(formValues.date).format("YYYY-MM-DD"),
          paymentMethod: formValues.paymentMethod as PaymentMethod,
          branch,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(`${t("toast")}`);
      },
    });
  };

  useEffect(() => {
    if (selectedExpenseId && getExpense) {
      getExpense({ id: selectedExpenseId });
    }
  }, [selectedExpenseId]);

  useEffect(() => {
    if (expense) {
      setValue("description", expense.description);
      setValue("date", expense.date);
      setValue("category", expense.category._id);
      setValue("paymentMethod", expense.paymentMethod);
    }
  }, [expense, setValue]);

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
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("description")}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              onChange={field.onChange}
              value={field.value}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label={t("date")}
              onChange={field.onChange}
              value={dayjs(field.value)}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <SingleSelect
              options={
                categories?.map((category) => ({
                  label: category.title,
                  value: category._id,
                })) || []
              }
              label={t("select_category")}
              onChange={field.onChange}
              value={field.value as any}
              error={!!errors.category}
              helperText={errors.category?.message}
            />
          )}
        />
        {!selectedExpenseId && (
          <Controller
            name="employee"
            control={control}
            render={({ field }) => (
              <SingleSelect
                options={
                  staff?.map((employee) => ({
                    label: employee.fullName,
                    value: employee._id,
                  })) || []
                }
                label={t("select_employee")}
                onChange={field.onChange}
                value={field.value as any}
                error={!!errors.employee}
                helperText={errors.employee?.message}
              />
            )}
          />
        )}

        {!selectedExpenseId && (
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
        )}
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <SingleSelect
              options={Object.values(PaymentMethod).map((method) => ({
                label: method,
                value: method,
              }))}
              label={t("select_payment_method")}
              onChange={field.onChange}
              value={field.value as any}
              error={!!errors.paymentMethod}
              helperText={errors.paymentMethod?.message}
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
          ) : selectedExpenseId ? (
            t("button.title_1")
          ) : (
            t("button.title_2")
          )}
        </Button>
      </Box>
    </form>
  );
};
