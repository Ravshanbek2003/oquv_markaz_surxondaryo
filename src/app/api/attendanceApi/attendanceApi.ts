import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  DeleteAttendanceRequest,
  DeleteAttendanceResponse,
  GetAllAttendanceRequest,
  GetAllAttendanceResponse,
  SetAttendanceRequest,
  SetAttendanceResponse,
} from "./types";
export const groupApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    setAttendance: build.mutation<SetAttendanceResponse, SetAttendanceRequest>({
      query: (body) => ({
        url: PATHS.SET,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.ATTENDANCE],
    }),

    getAllAttendance: build.query<
      GetAllAttendanceResponse,
      GetAllAttendanceRequest
    >({
      query: ({ year, group, month }) => {
        const queryParams = new URLSearchParams();
        if (year) queryParams.append("year", year);
        if (month) queryParams.append("month", month);

        return {
          url: `${PATHS.ALL}?group=${group}&${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [API_TAGS.ATTENDANCE],
    }),

    deleteAttendance: build.mutation<
      DeleteAttendanceResponse,
      DeleteAttendanceRequest
    >({
      query: ({ id }) => ({
        url: PATHS.GROUP_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.ATTENDANCE],
    }),
  }),
});

export const {
  useSetAttendanceMutation,
  useGetAllAttendanceQuery,
  useLazyGetAllAttendanceQuery,
  useDeleteAttendanceMutation,
} = groupApi;
