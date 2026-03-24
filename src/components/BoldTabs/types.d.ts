import { SxProps } from "@mui/material";
import { ReactNode } from "react";

export interface BoldTab {
  label: string | ReactNode;
  children: ReactNode;
  value?: string;
  leftSideContent?: ReactNode;
}

export type Props = {
  tabs: BoldTab[];
  defaultTabIndex?: number;
  contentClassName?: string;
  tabsClassName?: string;
  tabClassName?: string;
  tabName?: string;
  tabButtonSx?: SxProps;
};
