import { AddSectionForm, Modal } from "@/components";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const AddSection = ({ onClose, open, id }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "leads.card.add_section" });
  return (
    <Modal
      title={id ? `${t("title.title_1")}` : `${t("title.title_2")}`}
      open={open}
      onClose={onClose}
    >
      <AddSectionForm onClose={onClose} id={id as string} />
    </Modal>
  );
};
