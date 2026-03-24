import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useStudentValidation = (studentId?: string) => {
  const { t } = useTranslation("", { keyPrefix: "validation" });

  return yup.object({
    full_name: yup.string().required(t("full_name_required")),
    birth_date: yup.string().optional(),
    gender: yup.string().optional(),
    parent_phone_number: yup.string().optional(),
    phone_number: yup.string().required(t("phone_number_required")),
    group: studentId ? yup.string().optional() : yup.string().optional(),
    start_date_from: studentId
      ? yup.string().optional()
      : yup.string().optional(),
  });
};

export type studentValidationType = yup.InferType<
  ReturnType<typeof useStudentValidation>
>;
