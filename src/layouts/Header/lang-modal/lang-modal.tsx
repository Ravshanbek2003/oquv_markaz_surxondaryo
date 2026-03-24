/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal } from "@/components";
import { Props } from "./types";
import {
  Avatar,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import { LANGUAGES_CONSTANTS } from "@/constants";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const LangModal = ({ onClose, open }: Props) => {
  const { i18n } = useTranslation();

  const handleChangeLanguage = useCallback(
    (event: string) => {
      if (event) {
        i18n.changeLanguage(event);
        localStorage.setItem("language", event);
      }
    },
    [i18n]
  );

  const LANGUAGES = LANGUAGES_CONSTANTS();

  return (
    <Modal title={i18n.t("change_language")} onClose={onClose} open={open}>
      <FormControl sx={{ width: "100%", pl: 1 }}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          defaultValue="en"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
          }}
        >
          {LANGUAGES.map((lang, idx) => (
            <FormControlLabel
              key={idx}
              label={lang.name}
              control={
                <>
                  <Avatar sx={{ mr: 2 }} src={lang.icon} />
                  <input
                    type="text"
                    value={lang.code}
                    hidden
                    aria-hidden
                    readOnly
                  />
                </>
              }
              sx={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                width: "100%",
                px: 1,
                py: 1,
              }}
              value={lang.code}
              onClick={(event: any) => {
                handleChangeLanguage(event.target.value);
                onClose();
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Modal>
  );
};
