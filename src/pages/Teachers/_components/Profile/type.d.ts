export type Staff = {
  isLoading: boolean;
  staff: {
    _id: string;
    balance: number;
    fullName: string;
    phoneNumber: string;
    status: Status;
    role: Role;
    permissions: Permission[];
    createdAt: string;
    updatedAt: string;
    avatar: string;
    branches: { _id: string; title: string }[];
    groups?: number;
    password?: string;
    percent?: number;
    telegram?: string;
  };
};
