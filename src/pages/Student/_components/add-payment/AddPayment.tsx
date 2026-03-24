import { Modal, PaymentForm } from "@/components";
import { Props } from "./type";
import { useTranslation } from "react-i18next";

export const AddPayment = ({ onClose, open, userId, groups }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "students.student.add_payment",
  });
  return (
    <Modal title={t("title")} open={open} onClose={onClose}>
      <PaymentForm userId={userId} onClose={onClose} studentGroups={groups} />
    </Modal>
  );
};
