import { LogsStatus, Status } from "@/constants";

export type Common = {
  _id: string;
  fullName: string;
};

export type Group = {
  _id: string;
  name: string;
};

export type GroupLog = {
  _id: string;
  user: Common;
  group: Group;
  student: Common;
  newStatus: LogsStatus;
  oldStatus: LogsStatus;
  createdAt: string;
  updatedAt: string;
};

export type StudentLog = {
  _id: string;
  user: Common;
  group: Group;
  student: Common;
  status: Status;
  newStatus: LogsStatus;
  oldStatus: LogsStatus;
  createdAt: string;
  updatedAt: string;
};

export interface GetGroupLogsRequest {
  groupId: string;
  page?: number;
  perPage?: number;
}
export interface GetGroupLogsResponse {
  logs: GroupLog[];
  page: number;
  perPage: number;
  total: number;
  count: number;
}

export interface GetStudentLogsRequest {
  studentId: string;
  page?: number;
  perPage?: number;
}
export interface GetStudentLogsResponse {
  logs: StudentLog[];
  page: number;
  perPage: number;
  total: number;
  count: number;
}
