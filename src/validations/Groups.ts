import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useGroupsValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.students" });

  return yup.object({
    group: yup.string().required(t("group_required")),
    group_date: yup.string().required(t("group_date_required")),
  });
};

export type groupsValidationType = yup.InferType<
  ReturnType<typeof useGroupsValidation>
>;
