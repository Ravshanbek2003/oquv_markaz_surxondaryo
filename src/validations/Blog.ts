import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useBlogValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.notification" });

  return yup.object({
    blog_title: yup.string().required(t("title_required")),
    blog_users: yup.array().of(yup.string()).optional(),
    blog_content: yup.string().required(t("content_required")),
  });
};

export type BlogValidationType = yup.InferType<
  ReturnType<typeof useBlogValidation>
>;
