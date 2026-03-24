import { Status } from "@/constants";

export type Section = {
  _id: string;
  title: string;
  branch: string;
  status: Status;
  leads?: number;
  createdAt: string;
  updatedAt: string;
};

export interface AddSectionRequest {
  title: string;
  branch: string;
}
export interface AddSectionResponse {
  msg: string;
}

export interface GetAllSectionsRequest {
  branch: string;
}
export interface GetAllSectionsResponse {
  sections: Section[];
}

export interface GetSectionRequest {
  id: string;
}
export interface GetSectionResponse {
  _id: string;
  title: string;
  branch: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSectionRequest {
  id: string;
  title?: string;
}
export interface UpdateSectionResponse {
  msg: string;
}

export interface SectionToGroupRequest {
  id: string;
  body: {
    name: string;
    course: string;
    teacher: string;
    room: string;
    days: number[];
    startTime: number;
    startDate: string;
    endDate: string;
  };
}
export interface SectionToGroupResponse {
  msg: string;
}

export interface DeleteSectionRequest {
  id: string;
}
export interface DeleteSectionResponse {
  msg: string;
}
