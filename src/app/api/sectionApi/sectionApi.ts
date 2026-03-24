import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddSectionRequest,
  AddSectionResponse,
  DeleteSectionRequest,
  DeleteSectionResponse,
  GetAllSectionsRequest,
  GetAllSectionsResponse,
  GetSectionRequest,
  GetSectionResponse,
  SectionToGroupRequest,
  SectionToGroupResponse,
  UpdateSectionRequest,
  UpdateSectionResponse,
} from "./types";

export const sectionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addSection: build.mutation<AddSectionResponse, AddSectionRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.SECTION],
    }),

    getAllSections: build.query<GetAllSectionsResponse, GetAllSectionsRequest>({
      query: ({ branch }) => ({
        url: `${PATHS.ALL}?branch=${branch}`,
        method: "GET",
      }),
      providesTags: [API_TAGS.SECTION],
    }),

    getSection: build.query<GetSectionResponse, GetSectionRequest>({
      query: ({ id }) => ({
        url: PATHS.SECTION_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.SECTION],
    }),

    updateSection: build.mutation<UpdateSectionResponse, UpdateSectionRequest>({
      query: ({ id, title }) => ({
        url: PATHS.SECTION_ID + id,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: [API_TAGS.SECTION],
    }),

    sectionToGroup: build.mutation<
      SectionToGroupResponse,
      SectionToGroupRequest
    >({
      query: ({ id, body }) => ({
        url: PATHS.SECTION_ID + id,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.SECTION],
    }),

    deleteSection: build.mutation<DeleteSectionResponse, DeleteSectionRequest>({
      query: ({ id }) => ({
        url: PATHS.SECTION_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.SECTION],
    }),
  }),
});

export const {
  useAddSectionMutation,
  useGetAllSectionsQuery,
  useGetSectionQuery,
  useLazyGetSectionQuery,
  useUpdateSectionMutation,
  useSectionToGroupMutation,
  useDeleteSectionMutation,
} = sectionApi;
