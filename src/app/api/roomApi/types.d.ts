/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Room = {
  _id: string;
  title: string;
  branch: {
    _id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
};

export interface AddRoomRequest {
  title: string;
  branch: string;
}
export interface AddRoomResponse {
  msg: string;
}

export interface GetAllRoomsRequest {
  branchID: string;
}
export interface GetAllRoomsResponse {
  rooms: Room[];
}

export interface GetRoomRequest {
  id: string;
}
export interface GetRoomResponse extends Room {}

export interface UpdateRoomRequest {
  id: string;
  body: {
    title?: string;
  };
}
export interface UpdateRoomResponse {
  msg: string;
}

export interface DeleteRoomRequest {
  id: string;
}
export interface DeleteRoomResponse {
  msg: string;
}
