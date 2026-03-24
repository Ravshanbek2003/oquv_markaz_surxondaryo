import { Gender, Status } from "@/constants";
import { Teacher } from "../groupApi/types";

export type Common = {
  _id: string;
  title: string;
};

export type Course = {
  _id: string;
  title: string;
  lessonDuration: number;
  duration: number;
  price: number;
};

export interface AddStudentRequest {
  branch: string;
  fullName: string;
  phoneNumber: string;
  parentPhone?: string;
  birthday?: string;
  gender?: string;
  group?: string;
  startDate?: string;
}
export interface AddStudentResponse {
  msg: string;
}

export interface GetAllStudentsRequest {
  branchId: string;
  study?: string;
  status?: Status;
  search?: string;
  teacherId?: string;
  courseId?: string;
  groupId?: string;
  page?: number;
  perPage?: number;
}
export interface GetAllStudentsResponse {
  students: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    groups: {
      _id: string;
      group: {
        _id: string;
        name: string;
        course: Common;
        teacher: Teacher;
      };
      status: "ACTIVE" | "FROZEN" | "LEFT";
    }[];
  }[];
  total: number;
  page: number;
  perPage: number;
  count: number;
}
export interface GetStudentRequest {
  id: string;
}
export interface GetStudentResponse {
  _id: string;
  branch: Common;
  status: Status;
  fullName: string;
  birthday: string;
  gender: Gender;
  phoneNumber: string;
  parentPhone: string;
  createdAt: string;
  updatedAt: string;
  groups: {
    _id: string;
    student: string;
    group: {
      _id: string;
      name: string;
      status: Status;
      branch: string;
      course: Course;
      teacher: Common;
      room: string;
      days: number[];
      startTime: number;
      startDate: string;
      endDate: string;
      createdAt: string;
      updatedAt: string;
    };
    startDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface UpdateStudentRequest {
  id: string;
  body: Partial<{
    branch: string;
    fullName: string;
    phoneNumber: string;
    parentPhone: string;
    birthday: string;
    gender: Gender;
    group: string;
    startDate: string;
    status: Status;
  }>;
}
export interface UpdateStudentResponse {
  msg: string;
}

export interface AddToGroupRequest {
  studentId: string;
  body: {
    action: "add" | "set";
    group: string;
    startDate: string;
    status?: string;
  };
}
export interface AddToGroupResponse {
  msg: string;
}

export interface DeleteStudentRequest {
  id: string;
}
export interface DeleteStudentResponse {
  msg: string;
}
