import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  GetGroupLogsRequest,
  GetGroupLogsResponse,
  GetStudentLogsRequest,
  GetStudentLogsResponse,
} from "./types";

export const logsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getGroupLogs: build.query<GetGroupLogsResponse, GetGroupLogsRequest>({
      query: ({ groupId, page, perPage }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (perPage) params.append("perPage", perPage.toString());

        return {
          url: `${PATHS.LOGS_GROUP}?id=${groupId}&${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [API_TAGS.LOGS],
    }),

    getStudentLogs: build.query<GetStudentLogsResponse, GetStudentLogsRequest>({
      query: ({ studentId, page, perPage }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (perPage) params.append("perPage", perPage.toString());

        return {
          url: `${PATHS.LOGS_STUDENT}?id=${studentId}&${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [API_TAGS.LOGS],
    }),
  }),
});

export const {
  useGetGroupLogsQuery,
  useGetStudentLogsQuery,
  useLazyGetGroupLogsQuery,
  useLazyGetStudentLogsQuery,
} = logsApi;
