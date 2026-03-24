import { DashboardCard } from "@/components";
import { FaUserPlus } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { IoLayersSharp } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { PiSmileySadLight } from "react-icons/pi";
import { TimeTable } from "./_components/time-table";
import {
  useGetAllGroupsQuery,
  useGetAllRoomsQuery,
  useGetSettingsDashboardQuery,
} from "@/app/api";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { t } = useTranslation("", { keyPrefix: "dashboard" });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const { data: { rooms } = {}, isLoading: isLoadingRooms } =
    useGetAllRoomsQuery({
      branchID: branch,
    });

  const { data: { groups } = {}, isLoading: isLoadingGroups } =
    useGetAllGroupsQuery({ branch });
  const {
    data = {
      activeLeads: 0,
      activeStudents: 0,
      leftStudents: 0,
      paidThisMonth: 0,
    },
  } = useGetSettingsDashboardQuery({ branch });

  const navigate = useNavigate();
  return (
    <div className="pb-6">
      <Box
        sx={{
          display: "grid",
          gap: {
            xs: "4px",
            sm: "6px",
            md: "8px",
            lg: "16px",
          },
          gridTemplateColumns: {
            xs: "repeat(3, 1fr)",
            md: "repeat(6, 1fr)",
          },
          paddingBottom: {
            xs: "4px",
            sm: "6px",
            md: "8px",
            lg: "16px",
          },
        }}
      >
        <DashboardCard
          title={t("active_leadsc")}
          icon={<FaUserPlus size={32} className="text-[#26b5f3]" />}
          value={`${data?.activeLeads || 0}`}
          onClick={() => navigate(`/leads`)}
        />
        <DashboardCard
          title={t("active_students")}
          icon={<FaGraduationCap size={32} className="text-[#0acc13]" />}
          value={`${data?.activeStudents || 0}`}
          onClick={() => navigate(`/students`)}
        />
        <DashboardCard
          title={t("groups")}
          icon={<IoLayersSharp size={32} className="text-[#439cd8]" />}
          value={`${groups?.length || 0}`}
          onClick={() => navigate(`/groups`)}
        />
        <DashboardCard
          title={t("paid_this_month")}
          icon={<FaCheckCircle size={29} className="text-[#0acc13]" />}
          value={`${data?.paidThisMonth || 0}`}
          onClick={() => navigate(`/students`)}
        />
        <DashboardCard
          title={t("unpaid_students")}
          icon={<BiError size={32} className="text-[#df4a4a]" />}
          value={`${(data?.activeStudents || 0) - (data?.paidThisMonth || 0)}`}
          onClick={() => navigate(`/students`)}
        />

        <DashboardCard
          title={t("left_students")}
          icon={<PiSmileySadLight size={32} className="text-[#f63f3fe7]" />}
          value={`${data?.leftStudents || 0}`}
          onClick={() => navigate(`/students`)}
        />
      </Box>
      <TimeTable
        isLoading={isLoadingRooms || isLoadingGroups}
        groups={groups}
        rooms={rooms}
      />
    </div>
  );
};
