import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useAddSectionValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.lead" });

  return yup.object({
    section_name: yup.string().required(t("section_name_required")),
  });
};

export type AddSectionFormValue = yup.InferType<
  ReturnType<typeof useAddSectionValidation>
>;
