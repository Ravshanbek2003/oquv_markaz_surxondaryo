/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Course = {
  _id: string;
  title: string;
  image: string;
  description: string;
  lessonDuration: number;
  duration: number;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export interface AddCourseRequest {
  branch: string;
  title: string;
  description?: string;
  image: string;
  lessonDuration: number;
  duration: number;
  price: number;
}
export interface AddCourseResponse {
  msg: string;
}

export interface GetAllCoursesRequest {
  branchID: string;
}
export interface GetAllCoursesResponse {
  courses: Course[];
}

export interface GetCourseRequest {
  id: string;
}
export interface GetCourseResponse extends Course {}

export interface UpdateCourseRequest {
  id: string;
  body: {
    title?: string;
    description?: string;
    image?: string;
    price?: number;
    duration?: number;
    lessonDuration?: number;
  };
}
export interface UpdateCourseResponse {
  msg: string;
}

export interface DeleteCourseRequest {
  id: string;
}
export interface DeleteCourseResponse {
  msg: string;
}
