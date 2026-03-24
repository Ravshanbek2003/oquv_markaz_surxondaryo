import { BlogForm, Modal } from "@/components";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const AddModal = ({ onClose, open, notificationID }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "notification.add_modal.title",
  });
  return (
    <Modal
      title={notificationID ? `${t("title_1")}` : `${t("title_2")}`}
      open={open}
      onClose={onClose}
    >
      <BlogForm notificationID={notificationID} onClose={onClose} />
    </Modal>
  );
};
