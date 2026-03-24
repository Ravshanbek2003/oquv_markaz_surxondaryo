import { Modal, SendForm } from "@/components";
import { Props } from "./type";
import { useTranslation } from "react-i18next";

export const SendModal = ({ onClose, open }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "students.student.send_modal",
  });
  return (
    <Modal title={t("title")} open={open} onClose={onClose}>
      <SendForm />
    </Modal>
  );
};
