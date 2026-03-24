import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddStudentRequest,
  AddStudentResponse,
  AddToGroupRequest,
  AddToGroupResponse,
  DeleteStudentRequest,
  DeleteStudentResponse,
  GetAllStudentsRequest,
  GetAllStudentsResponse,
  GetStudentRequest,
  GetStudentResponse,
  UpdateStudentRequest,
  UpdateStudentResponse,
} from "./types";

export const studentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addStudent: build.mutation<AddStudentResponse, AddStudentRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.STUDENT],
    }),

    getAllStudents: build.query<GetAllStudentsResponse, GetAllStudentsRequest>({
      query: ({
        branchId,
        status,
        search,
        groupId,
        courseId,
        teacherId,
        page,
        perPage,
        study,
      }) => {
        const queryParams = new URLSearchParams();

        if (branchId) queryParams.append("branch", branchId);
        if (search) queryParams.append("search", search);
        if (groupId) queryParams.append("group", groupId);
        if (courseId) queryParams.append("course", courseId);
        if (teacherId) queryParams.append("teacher", teacherId);
        if (study) queryParams.append("study", study);
        if (typeof status === "number")
          queryParams.append("status", status.toString());
        if (page) queryParams.append("page", page.toString());
        if (perPage) queryParams.append("perPage", perPage.toString());

        return {
          url: `${PATHS.ALL}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [API_TAGS.STUDENT],
    }),

    getStudent: build.query<GetStudentResponse, GetStudentRequest>({
      query: ({ id }) => ({
        url: PATHS.STUDENT_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.STUDENT],
    }),

    updateStudent: build.mutation<UpdateStudentResponse, UpdateStudentRequest>({
      query: ({ id, body }) => ({
        url: PATHS.STUDENT_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.STUDENT],
    }),

    addToGroup: build.mutation<AddToGroupResponse, AddToGroupRequest>({
      query: ({ studentId, body }) => ({
        url: PATHS.STUDENT_ID + studentId,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.STUDENT],
    }),

    deleteStudent: build.mutation<DeleteStudentResponse, DeleteStudentRequest>({
      query: ({ id }) => ({
        url: PATHS.STUDENT_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.STUDENT],
    }),
  }),
});

export const {
  useAddStudentMutation,
  useGetAllStudentsQuery,
  useLazyGetAllStudentsQuery,
  useGetStudentQuery,
  useLazyGetStudentQuery,
  useAddToGroupMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
