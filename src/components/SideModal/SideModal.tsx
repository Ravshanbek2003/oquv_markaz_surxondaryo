import React from "react";
import { Props } from "./types";
import { IconButton, Typography } from "@mui/material";
import { VscClose } from "react-icons/vsc";

export const SideModal: React.FC<Props> = ({
  open,
  onClose,
  children,
  title,
}) => (
  <div>
    {open && (
      <div
        onClick={onClose}
        className={` ${
          open ? "right-0 fade-in-0" : "animate-out fade-out-0 -left-full"
        } fixed inset-0 z-50 bg-background/10 backdrop-blur-sm`}
      ></div>
    )}
    <div
      className={`!transition-all !duration-500 ${
        open ? "right-0" : "-left-[50%] "
      } inset-y-0 w-3/4 right-0 h-full border-l sm:max-w-sm fixed z-50 gap-4 bg-background bg-white p-6 shadow-lg `}
    >
      <div className="flex items-center justify-between">
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} color="primary">
          <VscClose />
        </IconButton>
      </div>
      <div>{children}</div>
    </div>
  </div>
);
