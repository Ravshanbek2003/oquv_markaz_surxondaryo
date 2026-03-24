export type StudentControlPanelProps = {
  student: {
    fullName: string;
    groups: {
      group: {
        name: string;
        teacher: {
          _id: string;
          fullName: string;
        };
        _id: string;
      };
      status: "ACTIVE" | "FROZEN" | "LEFT";
      _id: string;
    }[];
    phoneNumber: string;
    _id: string;
  };
  isAllowed: boolean;
  groupId: string;
  groupStartDate: string;
};
