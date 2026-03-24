import { BoldTabs } from "@/components";
import { Stack } from "@mui/material";
import { GroupsArchive } from "./_components/Groups";
import { Leads } from "./_components/Leads";
import { Staff } from "./_components/Staff";
import { Students } from "./_components/Students";
import { useTranslation } from "react-i18next";

export const Archive = () => {
  const { t } = useTranslation("", { keyPrefix: "settings.archive" });
  return (
    <div className="pb-10">
      <Stack direction="row" sx={{ pb: 4 }} justifyContent="space-between">
        <BoldTabs
          tabs={[
            {
              label: t("groups_tabs.title"),
              children: <GroupsArchive />,
              value: "groups",
            },
            {
              label: t("students_tabs.title"),
              children: <Students />,
              value: "students",
            },
            {
              label: t("staff_tabs.title"),
              children: <Staff />,
              value: "staff",
            },
            {
              label: t("leads_tabs.title"),
              children: <Leads />,
              value: "leads",
            },
          ]}
        />
      </Stack>
    </div>
  );
};
