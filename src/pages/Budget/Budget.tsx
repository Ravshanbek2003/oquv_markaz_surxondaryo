import { BoldTabs, RangeDatePicker } from "@/components";
import { Box, Button, Stack } from "@mui/material";
import { GoPlus } from "react-icons/go";
import { AddModal, Category, Expense, Income } from "./_components";
import { useState } from "react";
import { AddExpense } from "./_components/AddExpense";
import { useTranslation } from "react-i18next";
import { Expected } from "./_components/Expected";

export const Budget = () => {
  const { t } = useTranslation("", { keyPrefix: "budget" });
  const [createNewCategory, setCreateNewCategory] = useState(false);
  const [expenseDate, setExpenseDate] = useState<{
    startDate: string | Date;
    endDate: string | Date;
  }>({
    startDate: "",
    endDate: "",
  });
  const [incomeValue, setIncomeValue] = useState<{
    startDate: string | Date;
    endDate: string | Date;
  }>({
    startDate: "",
    endDate: "",
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  const handleModalChange = () => {
    setCreateNewCategory(false);
    setTimeout(() => {
      setSelectedCategory("");
    }, 500);
  };

  return (
    <div className="pb-10">
      <Stack direction="row" sx={{ pb: 4 }} justifyContent={"space-between"}>
        <BoldTabs
          tabs={[
            {
              label: t("income.title"),
              children: <Income incomeDate={incomeValue} />,
              value: "income",
              leftSideContent: (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      sm: "flex-end",
                    },
                  }}
                >
                  <RangeDatePicker
                    dateValue={incomeValue}
                    setDateValue={setIncomeValue}
                  />
                </Box>
              ),
            },
            {
              label: t("expected.title"),
              children: <Expected />,
              value: "expected",
            },
            {
              label: t("category.title"),
              children: (
                <Category
                  setSelectedCategory={setSelectedCategory}
                  onModalChange={() => setCreateNewCategory(true)}
                />
              ),
              value: "category",
              leftSideContent: (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      sm: "flex-end",
                    },
                  }}
                >
                  <Button
                    startIcon={<GoPlus />}
                    variant="contained"
                    color="primary"
                    onClick={() => setCreateNewCategory(true)}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "auto",
                      },
                      boxShadow: "none",
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      padding: {
                        xs: "4px 24px",
                        sm: "10px 24px",
                        md: "11px 24px",
                      },
                    }}
                  >
                    {t("category.button")}
                  </Button>
                </Box>
              ),
            },
            {
              label: t("expense.title"),
              children: <Expense expenseDate={expenseDate} />,
              value: "expense",
              leftSideContent: (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column-reverse",
                      sm: "row",
                      md: "column-reverse",
                      lg: "row",
                    },

                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <RangeDatePicker
                    dateValue={expenseDate}
                    setDateValue={setExpenseDate}
                  />
                  <Button
                    startIcon={<GoPlus />}
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenExpenseModal(true)}
                    sx={{
                      boxShadow: "none",
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      padding: {
                        xs: "4px 24px",
                        sm: "8px 24px",
                        md: "11px 24px",
                      },
                      width: "100%",
                    }}
                  >
                    {t("expense.button")}
                  </Button>
                </Box>
              ),
            },
          ]}
        />
      </Stack>
      <AddModal
        open={createNewCategory}
        onClose={handleModalChange}
        selectedCategoryId={selectedCategory}
      />
      <AddExpense
        open={openExpenseModal}
        onClose={() => setOpenExpenseModal(false)}
      />
    </div>
  );
};
