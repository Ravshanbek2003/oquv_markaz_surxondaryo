import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddGroupRequest,
  AddGroupResponse,
  AddStudentsGroupRequest,
  AddStudentsGroupResponse,
  DeleteGroupRequest,
  DeleteGroupResponse,
  GetAllGroupsRequest,
  GetAllGroupsResponse,
  GetGroupRequest,
  GetGroupResponse,
  UpdateGroupRequest,
  UpdateGroupResponse,
} from "./types";

export const groupApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addGroup: build.mutation<AddGroupResponse, AddGroupRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.GROUP],
    }),

    getAllGroups: build.query<GetAllGroupsResponse, GetAllGroupsRequest>({
      query: ({ branch, course, room, teacher, status }) => {
        const queryParams = new URLSearchParams();
        if (course) queryParams.append("course", course);
        if (room) queryParams.append("room", room);
        if (teacher) queryParams.append("teacher", teacher);
        if (typeof status === "number")
          queryParams.append("status", status.toString());

        return {
          url: `${PATHS.ALL}?branch=${branch}&${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [API_TAGS.GROUP],
    }),

    getGroup: build.query<GetGroupResponse, GetGroupRequest>({
      query: ({ id }) => ({
        url: PATHS.GROUP_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.GROUP],
    }),

    updateGroup: build.mutation<UpdateGroupResponse, UpdateGroupRequest>({
      query: ({ id, body }) => ({
        url: PATHS.GROUP_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.GROUP],
    }),
    addStudentsGroup: build.mutation<
      AddStudentsGroupResponse,
      AddStudentsGroupRequest
    >({
      query: ({ id, body }) => ({
        url: PATHS.GROUP_ID + id,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.GROUP, API_TAGS.STUDENT],
    }),

    deleteGroup: build.mutation<DeleteGroupResponse, DeleteGroupRequest>({
      query: ({ id }) => ({
        url: PATHS.GROUP_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.GROUP],
    }),
  }),
});

export const {
  useAddGroupMutation,
  useGetAllGroupsQuery,
  useLazyGetAllGroupsQuery,
  useGetGroupQuery,
  useLazyGetGroupQuery,
  useUpdateGroupMutation,
  useAddStudentsGroupMutation,
  useDeleteGroupMutation,
} = groupApi;
