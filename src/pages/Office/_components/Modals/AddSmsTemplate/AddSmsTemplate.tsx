import { Modal } from "@/components";
import { Props } from "./types";
import { SmsForm } from "@/components/Form/SmsForm";
import { useTranslation } from "react-i18next";

export const AddSmsTemplate = ({ onClose, open, templateId }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.office.add_sms_template.title",
  });
  return (
    <Modal
      title={templateId ? t("title_1") : t("title_2")}
      open={open}
      onClose={onClose}
    >
      <SmsForm templateId={templateId} onClose={onClose} />
    </Modal>
  );
};
