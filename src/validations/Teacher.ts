import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useTeacherValidation = (teacherId?: string) => {
  const { t } = useTranslation("", { keyPrefix: "validation.teacher" });

  return yup.object({
    full_name: yup.string().required(t("full_name_required")),
    telegram_username: yup.string().optional(),
    percent: yup
      .string()
      .max(2, t("percent_max"))
      .required(t("percent_required")),
    branches: yup
      .array()
      .of(yup.string().required(t("branch_valid_string")))
      .min(1, t("branches_min_required"))
      .required(t("branches_required")),
    phone_number: yup.string().required(t("phone_number_required")),
    password: teacherId
      ? yup.string().optional()
      : yup.string().required(t("password_required")),
  });
};

export type teacherValidationType = yup.InferType<
  ReturnType<typeof useTeacherValidation>
>;
