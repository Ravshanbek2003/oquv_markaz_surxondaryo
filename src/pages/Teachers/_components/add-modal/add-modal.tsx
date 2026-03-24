import { Modal } from "@/components";
import { Props } from "./types";
import { TeacherForm } from "@/components/Form/TeacherForm/TeacherForm";
import { useTranslation } from "react-i18next";

export const AddModal = ({ onClose, open, teacherId }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "teachers.add_modal" });
  return (
    <Modal
      title={teacherId ? `${t("title.title_1")}` : `${t("title.title_2")}`}
      open={open}
      onClose={onClose}
    >
      <TeacherForm teacherId={teacherId} onClose={onClose} />
    </Modal>
  );
};
