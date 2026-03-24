import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useBranchValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.settings.ceo" });

  return yup.object({
    branch_name: yup.string().required(t("branch_name_required")),
  });
};

export type BranchValidationType = yup.InferType<
  ReturnType<typeof useBranchValidation>
>;
