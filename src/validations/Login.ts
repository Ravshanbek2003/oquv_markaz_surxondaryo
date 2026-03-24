import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useLoginValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.login" });

  return yup
    .object({
      phoneNumber: yup.string().required(t("email_required")),
      password: yup
        .string()
        .min(6, t("password_min_length"))
        .required(t("password_required")),
    })
    .required();
};

export type loginValidationType = yup.InferType<
  ReturnType<typeof useLoginValidation>
>;
