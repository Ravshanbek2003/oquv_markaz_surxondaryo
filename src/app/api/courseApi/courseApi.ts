import {
  AddCourseRequest,
  AddCourseResponse,
  DeleteCourseRequest,
  DeleteCourseResponse,
  GetAllCoursesRequest,
  GetAllCoursesResponse,
  GetCourseRequest,
  GetCourseResponse,
  UpdateCourseRequest,
  UpdateCourseResponse,
} from "./types";
import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCourses: build.query<GetAllCoursesResponse, GetAllCoursesRequest>({
      query: ({ branchID }) => ({
        url: `${PATHS.ALL}?branch=${branchID}`,
        method: "GET",
      }),
      providesTags: [API_TAGS.COURSE],
    }),
    addCourse: build.mutation<AddCourseResponse, AddCourseRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.COURSE],
    }),

    getCourse: build.query<GetCourseResponse, GetCourseRequest>({
      query: ({ id }) => ({
        url: PATHS.COURSE_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.COURSE],
    }),

    updateCourse: build.mutation<UpdateCourseResponse, UpdateCourseRequest>({
      query: ({ id, body }) => ({
        url: PATHS.COURSE_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.COURSE],
    }),

    deleteCourse: build.mutation<DeleteCourseResponse, DeleteCourseRequest>({
      query: ({ id }) => ({
        url: PATHS.COURSE_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.COURSE],
    }),
  }),
});
export const {
  useAddCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseQuery,
  useLazyGetCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
