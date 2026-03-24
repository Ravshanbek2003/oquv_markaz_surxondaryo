/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import { useErrorMsg } from "../use-error-msg";
import toast from "react-hot-toast";

export const useHandleError = () => {
  const { t } = useTranslation("", { keyPrefix: "error" });
  const getErrorMsg = useErrorMsg();

  return (error: any) => {
    toast.error(t(getErrorMsg(error)));
  };
};
