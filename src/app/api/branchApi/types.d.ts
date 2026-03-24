/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Status } from "@/constants";

export type Branch = {
  _id: string;
  title: string;
  status: Status;
  balance: number;
  createdAt: string;
  updatedAt: string;
};

export interface AddBranchRequest {
  title: string;
}
export interface AddBranchResponse {
  msg: string;
}

export interface GetAllBranchesRequest {}
export interface GetAllBranchesResponse {
  branches: Branch[];
}

export interface GetBranchRequest {
  id: string;
}
export interface GetBranchResponse extends Branch {}

export interface UpdateBranchRequest {
  id?: string;
  body: {
    title?: string;
    status?: Status;
  };
}
export interface UpdateBranchResponse {
  msg: string;
}

export interface DeleteBranchRequest {
  id: string;
}
export interface DeleteBranchResponse {
  msg: string;
}
