import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useCourseValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.settings.office" });

  return yup.object({
    course_name: yup.string().required(t("course_name_required")),
    course_img: yup
      .mixed<File | string>()
      .required(t("course_image_required"))
      .test("fileType", t("unsupported_file_format"), (value) => {
        if (value instanceof File) {
          // File validation
          return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        }
        if (typeof value === "string") {
          // Skip validation for existing URLs
          return true;
        }
        return false;
      }),
    lesson_duration: yup.string().required(t("lesson_duration_required")),
    course_duration: yup.string().required(t("course_duration_required")),
    course_price: yup.string().required(t("course_price_required")),
    course_description: yup.string().optional(),
  });
};

export type CourseValidationType = yup.InferType<
  ReturnType<typeof useCourseValidation>
>;
