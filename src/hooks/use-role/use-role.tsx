import { useMeQuery } from "@/app/api";

export const useRole = () => {
  const { data: { role, permissions } = {} } = useMeQuery({});
  return { role, permissions };
};
