import { CategoryForm, Modal } from "@/components";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const AddModal = ({ onClose, open, selectedCategoryId }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "budget.add_modal.title" });
  return (
    <Modal
      title={selectedCategoryId ? t("title_1") : t("title_2")}
      open={open}
      onClose={onClose}
    >
      <CategoryForm selectedCategoryId={selectedCategoryId} onClose={onClose} />
    </Modal>
  );
};
