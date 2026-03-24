import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Props } from "./types";
import CloseIcon from "@mui/icons-material/Close";

export const Modal = ({ children, open, onClose, title, maxWidth }: Props) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="scroll-dialog-title"
    aria-describedby="scroll-dialog-description"
    fullWidth
    maxWidth={maxWidth}
  >
    <DialogTitle id="alert-dialog-title" sx={{ p: 2 }}>
      {title || "Modal title"}
    </DialogTitle>
    <DialogContent sx={{ pt: "10px !important" }}>{children}</DialogContent>
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={(theme) => ({
        position: "absolute",
        right: 8,
        top: 8,
        color: theme.palette.grey[500],
      })}
    >
      <CloseIcon />
    </IconButton>
  </Dialog>
);
