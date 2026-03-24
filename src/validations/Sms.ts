import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useSmsValidations = () => {
  const { t } = useTranslation("", { keyPrefix: "validation" });

  const smsValidation = yup.object({
    template_text: yup.string().required(t("template_text_required")),
  });

  const sendSmsValidation = yup.object({
    sms_text: yup.string().required(t("sms_text_required")),
  });

  return { smsValidation, sendSmsValidation };
};

export type SendSmsType = yup.InferType<
  ReturnType<typeof useSmsValidations>["sendSmsValidation"]
>;
