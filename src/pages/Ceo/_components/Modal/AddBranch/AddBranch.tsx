import { BranchForm, Modal } from "@/components";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const AddBranch = ({ onClose, open, id }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.ceo.add_branch.title",
  });
  return (
    <Modal
      title={id ? t("title_1") : t("title_2")}
      open={open}
      onClose={onClose}
    >
      <BranchForm onClose={onClose} id={id} />
    </Modal>
  );
};
