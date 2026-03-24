export type FormValue = {
  group_name: string;
  start_time: number;
  group_start_date: string;
  group_end_date: string;
  days: number[];
  course: string;
  teacher: string;
  room: string;
};

export type Props = {
  groupId?: string;
  sectionId?: string;
  isLeadSection?: boolean;
  onClose: () => void;
};
