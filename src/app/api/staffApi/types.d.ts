import { Role, Status } from "@/constants";

export type Permission = {
  name: string;
  branch: string;
};

export type Staff = {
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
  branches: string[];
  groups?: number;
  password?: string;
  percent?: number;
  telegram?: string;
};

export interface AddStaffRequest {
  fullName: string;
  phoneNumber: string;
  role: Role;
  branches: string[];
  password: string;
  telegram?: string;
  percent?: number;
  permissions?: Permission[];
}
export interface AddStaffResponse {
  msg: string;
}

export interface GetAllStaffRequest {
  branchId: string;
  role?: Role;
  search?: string;
  status?: Status;
}
export interface GetAllStaffResponse {
  staff: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    avatar: string;
    role: Role;
    telegram: string;
    groups: number;
    percent?: number;
    telegram?: string;
  }[];
}

export interface GetStaffRequest {
  id: string;
}
export interface GetStaffResponse {
  branches: { _id: string; title: string }[];
  _id: string;
  fullName: string;
  phoneNumber: string;
  status: number;
  role: string;
  permissions: Permission[];
  balance: number;
  telegram: string;
  percent: number;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
  avatar?: string;
}

export interface UpdateStaffRequest {
  id: string;
  body: Partial<Staff>;
}
export interface UpdateStaffResponse {
  msg: string;
}

export interface DeleteStaffRequest {
  id: string;
}
export interface DeleteStaffResponse {
  msg: string;
}
