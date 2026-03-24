import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useAddStudentValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.groups" });

  return yup.object({
    student_select: yup
      .array()
      .of(yup.string().required())
      .min(1, t("at_least_one_student_required"))
      .required(t("student_selection_required")),
    student_date: yup.string().required(t("date_required")),
  });
};

export type AddStudentFormValue = yup.InferType<
  ReturnType<typeof useAddStudentValidation>
>;
