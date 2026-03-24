import { API_TAGS } from "@/constants";
import { PATHS } from "./path";
import { baseApi } from "../baseApi";
import {
  GetSettingsDashboardRequest,
  GetSettingsDashboardResponse,
  GetSettingsRequest,
  GetSettingsResponse,
  UpdateSettingsRequest,
  UpdateSettingsResponse,
} from "./types";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSettings: build.query<GetSettingsResponse, GetSettingsRequest>({
      query: () => ({
        url: PATHS.SETTINGS,
        method: "GET",
      }),
      providesTags: [API_TAGS.SETTINGS],
    }),
    getSettingsDashboard: build.query<
      GetSettingsDashboardResponse,
      GetSettingsDashboardRequest
    >({
      query: ({ branch }) => ({
        url: `${PATHS.SETTINGS_DASHBOARD}?branch=${branch}`,
        method: "GET",
        branch,
      }),
    }),

    updateSettings: build.mutation<
      UpdateSettingsResponse,
      Partial<UpdateSettingsRequest>
    >({
      query: (body) => ({
        url: PATHS.SETTINGS,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.SETTINGS],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetSettingsDashboardQuery,
} = settingsApi;
