import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useGroupValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.groups" });

  return yup.object({
    group_name: yup.string().required(t("group_name_required")),
    start_time: yup.number().required(t("start_time_required")),
    group_start_date: yup.string().required(t("group_start_date_required")),
    group_end_date: yup.string().required(t("group_end_date_required")),
    days: yup.array().required(t("days_required")),
    course: yup.string().required(t("course_required")),
    teacher: yup.string().required(t("teacher_required")),
    room: yup.string().required(t("room_required")),
  });
};

export type groupValidationType = yup.InferType<
  ReturnType<typeof useGroupValidation>
>;
