import { Modal, StudentForm } from "@/components";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const AddModal = ({ onClose, open, studentId }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "students.add_modal.title" });
  return (
    <Modal
      title={studentId ? `${t("title_1")}` : `${t("title_2")}`}
      open={open}
      onClose={onClose}
    >
      <StudentForm onClose={onClose} studentId={studentId} />
    </Modal>
  );
};
