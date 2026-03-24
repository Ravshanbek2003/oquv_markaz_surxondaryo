import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const usePaymentValidation = () => {
  const { t } = useTranslation("", {
    keyPrefix: "validation.students.payment",
  });

  return yup.object({
    group: yup.string().required(t("group_required")),
    method: yup.string().optional(),
    amount: yup.string().required(t("amount_required")),
    date: yup.string().required(t("date_required")),
    comment_text: yup.string().optional(),
  });
};

export type PaymentValidationType = yup.InferType<
  ReturnType<typeof usePaymentValidation>
>;
