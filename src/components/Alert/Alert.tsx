import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Modal } from "../Modal";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const Alert = ({
  onClose,
  onClick,
  title,
  text,
  open,
  isLoading,
  buttonText,
}: Props) => {
  const { t } = useTranslation("", { keyPrefix: "leads.card.alert" });
  return (
    <Modal onClose={onClose} title={title} open={open}>
      <Typography>{text}</Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button
          disabled={isLoading}
          autoFocus
          variant="contained"
          sx={{ py: 1 }}
          onClick={onClick}
        >
          {isLoading ? (
            <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
          ) : (
            buttonText || `${t("delete")}`
          )}
        </Button>
      </Box>
    </Modal>
  );
};
