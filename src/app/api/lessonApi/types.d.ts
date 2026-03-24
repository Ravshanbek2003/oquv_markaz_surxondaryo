export interface GetLessonRequest {
  id: string;
}
export interface GetLessonResponse {
  lessons: {
    _id: string;
    group: string;
    date: string;
    newDate: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export interface CancelLessonRequest {
  group: string;
  date: string;
}
export interface CancelLessonResponse {
  msg: string;
}

export interface MoveLessonResponse {
  id: string;
}
export interface MoveLessonRequest {
  group: string;
  date: string;
  newDate: string;
}

export interface ResetLessonRequest {
  group: string;
  date: string;
}
export interface ResetLessonResponse {
  msg: string;
}
