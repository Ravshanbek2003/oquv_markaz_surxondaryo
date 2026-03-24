import { useTranslation } from "react-i18next";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export const useGender = () => {
  const { t } = useTranslation("", { keyPrefix: "gender" });
  return [
    {
      label: t("male"),
      value: Gender.MALE,
    },
    {
      label: t("female"),
      value: Gender.FEMALE,
    },
  ];
};
