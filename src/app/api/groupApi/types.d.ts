import { Status } from "@/constants";

export type Course = {
  _id: string;
  title: string;
  lessonDuration: number;
};

export type Teacher = {
  _id: string;
  fullName: string;
};

export type Room = {
  _id: string;
  title: string;
};

export interface AddGroupRequest {
  name: string;
  branch: string;
  course: string;
  teacher: string;
  room: string;
  days: number[];
  startTime: number;
  startDate: string;
  endDate: string;
}
export interface AddGroupResponse {
  msg: string;
}

export interface GetAllGroupsRequest {
  branch: string;
  status?: Status;
  course?: string;
  room?: string;
  teacher?: string;
}
export interface GetAllGroupsResponse {
  groups: {
    _id: string;
    name: string;
    course: Course;
    teacher: Teacher;
    room: Room;
    days: number[];
    startTime: number;
    startDate: string;
    endDate: string;
    students: number;
  }[];
}

export interface GetGroupRequest {
  id: string;
}
export interface GetGroupResponse {
  _id: string;
  name: string;
  status: Status;
  branch: string;
  course: {
    _id: string;
    title: string;
    lessonDuration: number;
    duration: number;
    price: number;
  };
  price: number;
  teacher: Teacher;
  room: Room;
  days: number[];
  startTime: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  students: number;
}

export interface UpdateGroupRequest {
  id: string;
  body: Partial<{
    name: string;
    course: string;
    teacher: string;
    room: string;
    days: number[];
    startTime: number;
    startDate: string;
    endDate: string;
    status: Status;
  }>;
}
export interface UpdateGroupResponse {
  msg: string;
}
export interface AddStudentsGroupRequest {
  id: string;
  body: {
    students: string[];
    startDate: string;
  };
}
export interface AddStudentsGroupResponse {
  msg: string;
}

export interface DeleteGroupRequest {
  id: string;
}
export interface DeleteGroupResponse {
  msg: string;
}
