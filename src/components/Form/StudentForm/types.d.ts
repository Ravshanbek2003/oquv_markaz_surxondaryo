export type Props = {
  onClose: () => void;
  studentId?: string;
};

export type studentValidationType = {
  full_name: string;
  parent_phone_number: string;
  phone_number: string;
  group: string;
  gender: string;
  birth_date: string;
  start_date_from: string;

  
};