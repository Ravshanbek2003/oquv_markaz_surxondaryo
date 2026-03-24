export type FormValue = {
  full_name: string;
  telegram_username?: string;
  photo?: string;
  percent: string;
  branches: string[];
  phone_number: string;
  password?: string | undefined;
};

export type Props = {
  teacherId?: string;
  onClose: () => void;
};
