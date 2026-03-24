import { BoldTabs } from "@/components";
import { Stack } from "@mui/material";
import { History } from "../History";
import { Attendance } from "../Attendance";
import { GetGroupResponse } from "@/app/api/groupApi/types";
import { useTranslation } from "react-i18next";

export const GroupTabs = ({ group }: { group: GetGroupResponse }) => {
  const { t } = useTranslation("", { keyPrefix: "groups.group.group_tabs" });
  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      defaultValue="attendance"
      sx={{ pb: 10 }}
    >
      <BoldTabs
        tabs={[
          {
            label: `${t("attendance.title")}`,
            children: <Attendance group={group} />,
            value: "attendance",
          },
          {
            label: `${t("history.title")}`,
            children: <History />,
            value: "History",
          },
        ]}
      />
    </Stack>
  );
};
