import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  CancelLessonRequest,
  CancelLessonResponse,
  GetLessonRequest,
  GetLessonResponse,
  MoveLessonRequest,
  MoveLessonResponse,
  ResetLessonRequest,
  ResetLessonResponse,
} from "./types";

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLesson: build.query<GetLessonResponse, GetLessonRequest>({
      query: ({ id }) => ({
        url: PATHS.LESSON_ID + id,
        method: "GET",
        id,
      }),
      providesTags: [API_TAGS.LESSON],
    }),
    cancelLesson: build.mutation<CancelLessonResponse, CancelLessonRequest>({
      query: (body) => {
        return {
          url: PATHS.CANCEL,
          method: "DELETE",
          body,
        };
      },
/******  7566fa2d-7ca6-48a5-987e-3cd244a8a91a  *******/
      invalidatesTags: [API_TAGS.LESSON],
    }),
    moveLesson: build.mutation<MoveLessonResponse, MoveLessonRequest>({
      query: (body) => ({
        url: PATHS.MOVE,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.LESSON],
    }),
    resetLesson: build.mutation<ResetLessonResponse, ResetLessonRequest>({
      query: (body) => ({
        url: PATHS.RESET,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.LESSON],
    }),
  }),
});
export const {
  useGetLessonQuery,
  useCancelLessonMutation,
  useMoveLessonMutation,
  useResetLessonMutation,
} = lessonApi;
