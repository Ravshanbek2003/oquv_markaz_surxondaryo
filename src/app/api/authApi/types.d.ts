/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Role, Status } from "@/constants";

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}

export interface MeResponse {
  _id: string;
  fullName: string;
  phoneNumber: string;
  status: Status;
  role: Role;
  permissions: { name: string; branch: string; _id: string }[];
  branches?: string[];
  telegram?: string;
  balance?: number;
  percent?: number;
  createdAt: string;
  updatedAt: string;
  avatar: string;
}
export interface MeRequest {}

export interface UpdateMeRequest {
  fullName?: string;
  avatar?: string;
  telegram?: string;
  oldPassword?: string;
  newPassword?: string;
}
export interface UpdateMeResponse {}
