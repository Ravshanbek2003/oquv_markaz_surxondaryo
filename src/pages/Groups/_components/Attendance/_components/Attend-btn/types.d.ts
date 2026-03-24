export type AttendBtnProps = {
  studentStatus: string;
  date: Date;
  isAllowed: boolean;
  attend:
    | {
        createdAt: Date;
        date: string;
        group: string;
        status: PRESENT | ABSENT | REASON;
        student: string;
        updatedAt: Date;
        _id: string;
      }
    | undefined;
  cancelled:
    | {
        createdAt: Date;
        date: string;
        group: string;
        status: string;
        updatedAt: Date;
        _id: string;
      }
    | undefined;
  studentId: string;
  groupId: string;
};
