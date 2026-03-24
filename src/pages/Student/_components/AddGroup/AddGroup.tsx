import { GroupsForm, Modal } from "@/components";
import { Props } from "./type";
import { useTranslation } from "react-i18next";

export const AddGroup = ({
  open,
  onClose,
  studentId,
  groups,
  isLead = false,
}: Props) => {
  const { t } = useTranslation("", { keyPrefix: "leads.list.add_group" });
  return (
    <Modal title={t("title")} open={open} onClose={onClose}>
      <GroupsForm
        studentId={studentId}
        onClose={onClose}
        studentGroups={groups}
        isLead={isLead}
      />
    </Modal>
  );
};
