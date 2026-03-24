import { CommentForm, Modal } from "@/components";
import { Props } from "./type";
import { useTranslation } from "react-i18next";

export const AddModal = ({ onClose, open, studentId, commentId }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "students.student.add_modal.title",
  });

  return (
    <Modal
      title={commentId ? t("title_1") : t("title_2")}
      open={open}
      onClose={onClose}
    >
      <CommentForm
        onClose={onClose}
        studentId={studentId as string}
        commentId={commentId as string}
      />
    </Modal>
  );
};
