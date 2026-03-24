import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useExpenseValidation = (id?: string) => {
  const { t } = useTranslation("", { keyPrefix: "validation.budget" });

  return yup.object({
    description: yup.string().required(t("description_required")),
    date: yup.string().required(t("date_required")),
    category: yup.string().required(t("category_required")),
    employee: id
      ? yup.string().optional()
      : yup.string().required(t("employee_required")),
    amount: id
      ? yup.string().optional()
      : yup.string().required(t("amount_required")),
    paymentMethod: yup.string().required(t("payment_method_required")),
  });
};

export type expenseValidationType = yup.InferType<
  ReturnType<typeof useExpenseValidation>
>;
