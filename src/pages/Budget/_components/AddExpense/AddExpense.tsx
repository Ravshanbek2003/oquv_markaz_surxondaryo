import { ExpenseForm, Modal } from "@/components";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const AddExpense = ({ onClose, open, selectedExpenseId }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "budget.add_expense.title" });
  return (
    <Modal
      title={selectedExpenseId ? t("title_1") : t("title_2")}
      open={open}
      onClose={onClose}
    >
      <ExpenseForm onClose={onClose} selectedExpenseId={selectedExpenseId} />
    </Modal>
  );
};
