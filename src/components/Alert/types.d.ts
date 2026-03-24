export type Props = {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
  title: string;
  text?: string;
  isLoading?: boolean;
  buttonText?: string;
};
