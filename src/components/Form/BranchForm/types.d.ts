import { Status } from "@/constants";

export type FormValue = {
  branch_name: string;
  status?: Status;
};

export type Props = {
  onClose: () => void;
  id: string;
};
