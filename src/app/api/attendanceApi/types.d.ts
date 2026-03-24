export interface AttendanceRecord {
  _id: string;
  student: string;
  group: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "REASON";
  createdAt: Date;
  updatedAt: Date;
}

export interface SetAttendanceRequest {
  student: string;
  group: string;
  date: string;
  status: PRESENT | ABSENT | REASON;
}
export interface SetAttendanceResponse {
  msg: string;
}

export interface GetAllAttendanceRequest {
  group: string;
  year: string;
  month: string;
}
export interface GetAllAttendanceResponse {
  attendance: AttendanceRecord[];
}

export interface DeleteAttendanceRequest {
  id: string;
}
export interface DeleteAttendanceResponse {
  msg: string;
}
