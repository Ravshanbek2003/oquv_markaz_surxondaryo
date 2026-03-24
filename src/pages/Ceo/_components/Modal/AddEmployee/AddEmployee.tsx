import { EmployeeForm, Modal } from "@/components";
import { Props } from "./types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const AddEmployee = ({ onClose, open, selectedAdminId }: Props) => {
  const [maxWidth, setMaxWidth] = useState<
    "xs" | "sm" | "md" | "lg" | "xl" | undefined
  >(undefined);

  const { t } = useTranslation("", {
    keyPrefix: "settings.ceo.add_employee.title",
  });

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setMaxWidth("sm");
    }, 500);
  };

  return (
    <Modal
      title={selectedAdminId ? t("title_1") : t("title_2")}
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
    >
      <EmployeeForm
        selectedAdminId={selectedAdminId}
        setMaxWidth={setMaxWidth}
        onClose={onClose}
      />
    </Modal>
  );
};
