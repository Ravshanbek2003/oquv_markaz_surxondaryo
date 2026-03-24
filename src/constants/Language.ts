import { useTranslation } from "react-i18next";

interface Language {
  code: string;
  name: string;
  icon: string;
}

export const LANGUAGES_CONSTANTS: () => Language[] = () => {
  const { t } = useTranslation("", { keyPrefix: "lang" });
  return [
    { code: "en", name: t("eng"), icon: "/lang/eng.png" },
    { code: "ru", name: t("rus"), icon: "/lang/rus.png" },
    { code: "uz", name: t("uzb"), icon: "/lang/uzb.png" },
  ];
};
