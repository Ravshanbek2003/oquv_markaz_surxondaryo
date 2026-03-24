import { BoldTabs } from "@/components";
import { Stack } from "@mui/material";
import { Groups } from "../Groups";
import { Profile } from "../Profile";
import { SalaryTabs } from "../SalaryTabs";
import { useTranslation } from "react-i18next";

export const TeacherTabs = () => {
  const { t } = useTranslation("", { keyPrefix: "teachers.tabs" });
  return (
    <div>
      <Stack
        direction="row"
        sx={{
          pb: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
          },
        }}
        justifyContent={"space-between"}
      >
        <BoldTabs
          tabs={[
            {
              label: `${t("profile.title")}`,
              children: <Profile />,
              value: "profile",
            },
            {
              label: `${t("groups.title")}`,
              children: <Groups />,
              value: "groups",
            },
            {
              label: `${t("salary.title")}`,
              children: <SalaryTabs />,
              value: "salary",
            },
          ]}
        />
      </Stack>
    </div>
  );
};
