import * as yup from "yup";
import { useTranslation } from "react-i18next";

export const useCommentValidation = () => {
  const { t } = useTranslation("", { keyPrefix: "validation.students" });

  return yup.object({
    comment_text: yup.string().required(t("comment_text_required")),
  });
};

export type CommentType = yup.InferType<
  ReturnType<typeof useCommentValidation>
>;
