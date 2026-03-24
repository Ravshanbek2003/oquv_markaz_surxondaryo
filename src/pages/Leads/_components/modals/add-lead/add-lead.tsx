import { AddLeadForm, Modal } from "@/components";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const AddLead = ({ onClose, open, id }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "leads.add_lead" });
  return (
    <Modal
      title={id ? `${t("title.title_1")}` : `${t("title.title_2")}`}
      open={open}
      onClose={onClose}
    >
      <AddLeadForm onClose={onClose} id={id as string} />
    </Modal>
  );
};
