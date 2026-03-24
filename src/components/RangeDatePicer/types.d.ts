// import { Dayjs } from "dayjs";

export type Props = {
  dateValue: {
    startDate: string | Date;
    endDate: string | Date;
  };
  setDateValue: (value: {
    startDate: Date | string;
    endDate: Date | string;
  }) => void;
};

// {
//   startDate: '2024-11-01',
//   endDate: '2024-12-01'
// }
