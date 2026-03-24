import { useTranslation } from "react-i18next";
import { Props } from "./types";
import { GroupForm, Modal } from "@/components";

export const AddModal = ({
  onClose,
  open,
  groupId,
  isLeadSection = false,
  sectionId,
}: Props) => {
  const { t } = useTranslation("", { keyPrefix: "leads.card.section_card" });

  return (
    <Modal
      title={
        groupId
          ? `${t("add_group.title.title_1")}`
          : `${t("add_group.title.title_2")}`
      }
      open={open}
      onClose={onClose}
    >
      <GroupForm
        groupId={groupId}
        onClose={onClose}
        isLeadSection={isLeadSection}
        sectionId={sectionId}
      />
    </Modal>
  );
};
