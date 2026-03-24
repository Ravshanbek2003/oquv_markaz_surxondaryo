import { BoldTabs } from "@/components";
import { Stack } from "@mui/material";
import { Expense } from "../Expense";
import { Income } from "../Income";
import { useTranslation } from "react-i18next";

export const SalaryTabs = () => {
  const { t } = useTranslation("", {
    keyPrefix: "teachers.tabs.salary.salary_tabs",
  });
  return (
    <div>
      <Stack direction="row" sx={{ pb: 4 }} justifyContent={"space-between"}>
        <BoldTabs
          tabs={[
            {
              label: `${t("income.title")}`,
              children: <Income />,
              value: "Income",
            },
            {
              label: `${t("expense.title")}`,
              children: <Expense />,
              value: "Expense",
            },
          ]}
        />
      </Stack>
    </div>
  );
};
