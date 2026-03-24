import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddStaffRequest,
  AddStaffResponse,
  DeleteStaffRequest,
  DeleteStaffResponse,
  GetAllStaffRequest,
  GetAllStaffResponse,
  GetStaffRequest,
  GetStaffResponse,
  UpdateStaffRequest,
  UpdateStaffResponse,
} from "./types";

export const staffApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addStaff: build.mutation<AddStaffResponse, AddStaffRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.STAFF],
    }),

    getAllStaffs: build.query<GetAllStaffResponse, GetAllStaffRequest>({
      query: ({ branchId, role, search = "", status }) => {
        const params = new URLSearchParams();
        if (role) params.append("role", role);
        if (search) params.append("search", search);
        if (typeof status === "number")
          params.append("status", status.toString());

        return {
          url: `${PATHS.ALL}?branch=${branchId}&${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [API_TAGS.STAFF],
    }),

    getStaff: build.query<GetStaffResponse, GetStaffRequest>({
      query: ({ id }) => ({
        url: PATHS.STAFF_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.STAFF],
    }),

    updateStaff: build.mutation<UpdateStaffResponse, UpdateStaffRequest>({
      query: ({ id, body }) => ({
        url: PATHS.STAFF_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.STAFF],
    }),

    deleteStaff: build.mutation<DeleteStaffResponse, DeleteStaffRequest>({
      query: ({ id }) => ({
        url: PATHS.STAFF_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.STAFF],
    }),
  }),
});

export const {
  useAddStaffMutation,
  useGetAllStaffsQuery,
  useLazyGetAllStaffsQuery,
  useGetStaffQuery,
  useLazyGetStaffQuery,
  useDeleteStaffMutation,
  useUpdateStaffMutation,
} = staffApi;
