import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import {
  AddSourceRequest,
  AddSourceResponse,
  DeleteSourceRequest,
  DeleteSourceResponse,
  GetAllSourcesRequest,
  GetAllSourcesResponse,
  GetSourceRequest,
  GetSourceResponse,
  UpdateSourceRequest,
  UpdateSourceResponse,
} from "./types";
import { PATHS } from "./path";

export const sourceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addSource: build.mutation<AddSourceResponse, AddSourceRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.SOURCE],
    }),

    getAllSources: build.query<GetAllSourcesResponse, GetAllSourcesRequest>({
      query: () => ({
        url: PATHS.ALL,
        method: "GET",
      }),
      providesTags: [API_TAGS.SOURCE],
    }),

    getSource: build.query<GetSourceResponse, GetSourceRequest>({
      query: ({ id }) => ({
        url: PATHS.SOURCE_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.SOURCE],
    }),

    updateSource: build.mutation<UpdateSourceResponse, UpdateSourceRequest>({
      query: ({ id, title }) => ({
        url: PATHS.SOURCE_ID + id,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: [API_TAGS.SOURCE],
    }),

    deleteSource: build.mutation<DeleteSourceResponse, DeleteSourceRequest>({
      query: ({ id }) => ({
        url: PATHS.SOURCE_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.SOURCE],
    }),
  }),
});

export const {
  useAddSourceMutation,
  useGetAllSourcesQuery,
  useGetSourceQuery,
  useLazyGetSourceQuery,
  useUpdateSourceMutation,
  useDeleteSourceMutation,
} = sourceApi;
