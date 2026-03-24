import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useAddFromWhereValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.lead" });

  return yup.object({
    name: yup.string().required(t("from_where_name_required")),
  });
};

export type AddFromWhereFormValue = yup.InferType<
  ReturnType<typeof useAddFromWhereValidation>
>;
