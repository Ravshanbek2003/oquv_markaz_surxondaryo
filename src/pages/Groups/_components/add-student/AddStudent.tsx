import { AddStudentForm, Modal } from "@/components";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const AddStudent = ({ open, onClose, groupId }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "groups.group.menu.add_new_student",
  });
  return (
    <Modal title={t("title")} open={open} onClose={onClose}>
      <AddStudentForm groupId={groupId} onClose={onClose} />
    </Modal>
  );
};
