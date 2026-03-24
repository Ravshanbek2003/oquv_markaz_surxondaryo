import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useAddLeadValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.lead" });

  return yup.object({
    fullName: yup.string().required(t("full_name_required")),
    phoneNumber: yup.string().required(t("phone_number_required")),
    fromWhere: yup.string().optional(),
    section: yup.string().required(t("section_select_required")),
  });
};

export type AddLeadFormValue = yup.InferType<
  ReturnType<typeof useAddLeadValidation>
>;
