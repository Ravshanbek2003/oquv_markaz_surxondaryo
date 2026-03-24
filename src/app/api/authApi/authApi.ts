import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  LoginRequest,
  LoginResponse,
  MeRequest,
  MeResponse,
  UpdateMeRequest,
  UpdateMeResponse,
} from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: PATHS.LOGIN,
        method: "POST",
        body,
      }),
    }),
    edit: build.mutation<UpdateMeResponse, UpdateMeRequest>({
      query: (body) => ({
        url: PATHS.EDIT,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.USER],
    }),
    me: build.query<MeResponse, MeRequest>({
      query: () => ({
        url: PATHS.ME,
        method: "GET",
      }),
      providesTags: [API_TAGS.USER],
    }),
  }),
});

export const { useLoginMutation, useEditMutation, useMeQuery, useLazyMeQuery } =
  authApi;
