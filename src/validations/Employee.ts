import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useEmployeeValidation = (selectedAdminId?: string) => {
  const { t } = useTranslation("", {
    keyPrefix: "validation.settings.ceo.employee",
  });

  return yup.object({
    fullname: yup.string().required(t("full_name_required")),
    phone_number: yup.string().required(t("phone_number_required")),
    telegram_username: yup.string().optional(),
    password: selectedAdminId
      ? yup.string().optional()
      : yup.string().required(t("password_required")),
    branches: yup
      .array()
      .of(yup.string().required(t("branch_required")))
      .min(1, t("at_least_one_branch_required"))
      .required(t("branches_required")),
    role: yup.string().optional(),
    permissions: yup
      .array()
      .of(
        yup
          .object({
            name: yup.string().required(t("name_required")),
            branch: yup.string().required(t("branch_required")),
          })
          .required(t("permission_required"))
      )
      .min(1, t("at_least_one_permission_required"))
      .required(t("permissions_required")),
  });
};

export type EmployeeType = yup.InferType<
  ReturnType<typeof useEmployeeValidation>
>;
