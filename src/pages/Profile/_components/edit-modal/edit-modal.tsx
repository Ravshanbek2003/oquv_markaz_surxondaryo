import { EditForm, Modal } from "@/components";
import { Props } from "./type";
import { useTranslation } from "react-i18next";

export const EditProfile = ({ open, onClose }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "profile.edit_modal" });
  return (
    <Modal title={t("title")} open={open} onClose={onClose}>
      <EditForm onClose={onClose} />
    </Modal>
  );
};
