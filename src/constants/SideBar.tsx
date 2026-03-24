import { FaUserPlus } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa6";
import { IoLayers } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa6";
import { AiFillDollarCircle } from "react-icons/ai";
import { Permission } from "./Permission";
import { useTranslation } from "react-i18next";

export const SIDE_BAR_LINKS = () => {
  const { t } = useTranslation("", { keyPrefix: "layout.sidebar" });

  return [
    {
      label: t("dashboard"),
      icon: <BsFillGridFill size={17} className="mt-xp" />,
      path: "/dashboard",
    },
    {
      label: t("leads"),
      icon: <FaUserPlus size={20} className="mb-1 ml-px" />,
      path: "/leads",
      permission: Permission.LEADS,
    },
    {
      label: t("teachers"),
      icon: <FaUserTie size={17} className="mb-1" />,
      path: "/teachers",
      permission: Permission.TEACHERS,
    },
    {
      label: t("groups"),
      icon: <IoLayers size={18} className="mt-px" />,
      path: "/groups",
      permission: Permission.GROUPS,
    },
    {
      label: t("students"),
      icon: <FaUserGraduate size={16} className="mt-px" />,
      path: "/students",
      permission: Permission.STUDENTS,
    },
    {
      label: t("budget"),
      icon: <AiFillDollarCircle size={19} className="mt-px" />,
      path: "/budget",
      permission: Permission.BUDGET,
    },

    // DON'T DELETE THIS COMMENT
    // {
    //   label: "Report",
    //   icon: <BsBarChartFill size={17} className="mb-px" />,
    //   path: "/report",
    // },
  ];
};

export const SETTINGS_LINKS = () => {
  const { t } = useTranslation("", { keyPrefix: "layout.sidebar.settings" });
  return [
    {
      label: t("general"),
      path: "/settings/general",
    },
    {
      label: t("office"),
      path: "/settings/office",
    },
    {
      label: t("ceo"),
      path: "/settings/ceo",
    },
    {
      label: t("archive"),
      path: "/settings/archive",
    },
  ];
};
