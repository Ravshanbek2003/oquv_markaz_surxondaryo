import { Status } from "@/constants";

export type Common = {
  _id: string;
  title: string;
};

export type Lead = {
  _id: string;
  section: Common;
  source: Common;
  phoneNumber: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
};

export interface AddLeadRequest {
  branch: string;
  section: string;
  source: string;
  fullName: string;
  phoneNumber: string;
}
export interface AddLeadResponse {
  msg: string;
}

export interface GetAllLeadsRequest {
  branch: string;
  section?: string;
  source?: string;
  status?: Status;
  search?: string;
  page?: number;
  perPage?: number;
}
export interface GetAllLeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  perPage: number;
  count: number;
}

export interface GetLeadRequest {
  id: string;
}
export interface GetLeadResponse extends Lead {
  status: Status;
  branch: string;
}

export interface UpdateLeadRequest {
  id: string;
  body: Partial<{
    section: string;
    source: string;
    fullName: string;
    phoneNumber: string;
    status: Status;
  }>;
}
export interface UpdateLeadResponse {
  msg: string;
}

export interface LeadToStudentRequest {
  leadId: string;
  body: {
    group: string;
    startDate: string;
  };
}
export interface LeadToStudentResponse {
  msg: string;
}

export interface DeleteLeadRequest {
  id: string;
}
export interface DeleteLeadResponse {
  msg: string;
}
