export type Props = {
  open: boolean;
  onClose: () => void;
  studentId: string;
  groups: string[];
  isLead?: boolean;
};
