import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddLeadRequest,
  AddLeadResponse,
  DeleteLeadRequest,
  DeleteLeadResponse,
  GetAllLeadsRequest,
  GetAllLeadsResponse,
  GetLeadRequest,
  GetLeadResponse,
  LeadToStudentRequest,
  LeadToStudentResponse,
  UpdateLeadRequest,
  UpdateLeadResponse,
} from "./types";

export const leadsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addLead: build.mutation<AddLeadResponse, AddLeadRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.LEAD],
    }),

    getAllLeads: build.query<GetAllLeadsResponse, GetAllLeadsRequest>({
      query: ({ branch, page, perPage, search, section, source, status }) => {
        const params = new URLSearchParams();

        if (section) params.append("section", section);
        if (source) params.append("source", source);
        if (search) params.append("search", search);
        if (page) params.append("page", page.toString());
        if (perPage) params.append("perPage", perPage.toString());
        if (typeof status === "number")
          params.append("status", status.toString());

        return {
          url: `${PATHS.ALL}?branch=${branch}&${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [API_TAGS.LEAD],
    }),

    getLead: build.query<GetLeadResponse, GetLeadRequest>({
      query: ({ id }) => ({
        url: PATHS.LEAD_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.LEAD],
    }),

    updateLead: build.mutation<UpdateLeadResponse, UpdateLeadRequest>({
      query: ({ id, body }) => ({
        url: PATHS.LEAD_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.LEAD, API_TAGS.SECTION],
    }),

    deleteLead: build.mutation<DeleteLeadResponse, DeleteLeadRequest>({
      query: ({ id }) => ({
        url: PATHS.LEAD_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.LEAD],
    }),

    leadToStudent: build.mutation<LeadToStudentResponse, LeadToStudentRequest>({
      query: ({ body, leadId }) => ({
        url: PATHS.LEAD_ID + leadId,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.LEAD],
    }),
  }),
});

export const {
  useAddLeadMutation,
  useGetAllLeadsQuery,
  useGetLeadQuery,
  useLazyGetLeadQuery,
  useLazyGetAllLeadsQuery,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useLeadToStudentMutation,
} = leadsApi;
