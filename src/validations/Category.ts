import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useCategoryValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.budget" });

  return yup.object({
    category_name: yup.string().required(t("category_name_required")),
  });
};

export type CategoryValidationType = yup.InferType<
  ReturnType<typeof useCategoryValidation>
>;
