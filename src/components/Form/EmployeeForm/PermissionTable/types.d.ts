export type Props = {
  onChange: (value: { branch: string; name: string }[]) => void;
  values: { branch: string; name: string }[];
  branches: { _id: string; title: string }[];
};
