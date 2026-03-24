/* eslint-disable @typescript-eslint/no-empty-object-type */

export type Source = {
  _id: string;
  title: string;
  leads: number;
  createdAt: string;
  updatedAt: string;
};
export interface AddSourceRequest {
  title: string;
}
export interface AddSourceResponse {
  msg: string;
}

export interface GetAllSourcesRequest {}
export interface GetAllSourcesResponse {
  sources: Source[];
}

export interface GetSourceRequest {
  id: string;
}
export interface GetSourceResponse extends Source {}

export interface UpdateSourceRequest {
  id: string;
  title: string;
}
export interface UpdateSourceResponse {
  msg: string;
}

export interface DeleteSourceRequest {
  id: string;
}
export interface DeleteSourceResponse {
  msg: string;
}
