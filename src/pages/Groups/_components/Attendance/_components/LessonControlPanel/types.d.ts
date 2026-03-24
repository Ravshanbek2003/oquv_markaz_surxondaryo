export type LessonControlPanelProps = {
  groupId: string;
  date: Date;
  lessons: GetLessonResponse[];
  groupStartDate: string;
  isAllowed: boolean
};
