import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddSnippetRequest,
  AddSnippetResponse,
  DeleteSnippetRequest,
  DeleteSnippetResponse,
  GetAllSnippetsRequest,
  GetAllSnippetsResponse,
  GetSnippetRequest,
  GetSnippetResponse,
  UpdateSnippetRequest,
  UpdateSnippetResponse,
} from "./types";

export const snippedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSnippet: builder.mutation<AddSnippetResponse, AddSnippetRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.SNIPPET],
    }),

    getAllSnippets: builder.query<
      GetAllSnippetsResponse,
      GetAllSnippetsRequest
    >({
      query: () => ({
        url: PATHS.ALL,
        method: "GET",
      }),
      providesTags: [API_TAGS.SNIPPET],
    }),

    getSnippet: builder.query<GetSnippetResponse, GetSnippetRequest>({
      query: ({ id }) => ({
        url: PATHS.SNIPPED_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.SNIPPET],
    }),

    updateSnippet: builder.mutation<
      UpdateSnippetResponse,
      UpdateSnippetRequest
    >({
      query: ({ id, body }) => ({
        url: PATHS.SNIPPED_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.SNIPPET],
    }),

    deleteSnippet: builder.mutation<
      DeleteSnippetResponse,
      DeleteSnippetRequest
    >({
      query: ({ id }) => ({
        url: PATHS.SNIPPED_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.SNIPPET],
    }),
  }),
});

export const {
  useAddSnippetMutation,
  useGetAllSnippetsQuery,
  useGetSnippetQuery,
  useLazyGetSnippetQuery,
  useUpdateSnippetMutation,
  useDeleteSnippetMutation,
} = snippedApi;
