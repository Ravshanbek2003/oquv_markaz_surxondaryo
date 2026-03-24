import {
  AddBranchRequest,
  AddBranchResponse,
  DeleteBranchRequest,
  DeleteBranchResponse,
  GetAllBranchesRequest,
  GetAllBranchesResponse,
  GetBranchRequest,
  GetBranchResponse,
  UpdateBranchRequest,
  UpdateBranchResponse,
} from "./types";
import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";

export const branchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addBranch: build.mutation<AddBranchResponse, AddBranchRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.BRANCH],
    }),

    getAllBranches: build.query<GetAllBranchesResponse, GetAllBranchesRequest>({
      query: () => ({
        url: PATHS.ALL,
        method: "GET",
      }),
      providesTags: [API_TAGS.BRANCH],
    }),

    getBranch: build.query<GetBranchResponse, GetBranchRequest>({
      query: ({ id }) => ({
        url: PATHS.BRANCH_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.BRANCH],
    }),

    updateBranch: build.mutation<UpdateBranchResponse, UpdateBranchRequest>({
      query: ({ id, body }) => ({
        url: PATHS.BRANCH_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.BRANCH],
    }),

    deleteBranch: build.mutation<DeleteBranchResponse, DeleteBranchRequest>({
      query: ({ id }) => ({
        url: PATHS.BRANCH_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.BRANCH],
    }),
  }),
});

export const {
  useAddBranchMutation,
  useGetAllBranchesQuery,
  useGetBranchQuery,
  useLazyGetBranchQuery,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApi;
