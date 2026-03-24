import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddCategoryRequest,
  AddCategoryResponse,
  DeleteCategoryRequest,
  DeleteCategoryResponse,
  GetCategoriesRequest,
  GetCategoriesResponse,
  GetCategoryRequest,
  GetCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "./types";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addCategory: build.mutation<AddCategoryResponse, AddCategoryRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),

    getAllCategories: build.query<GetCategoriesResponse, GetCategoriesRequest>({
      query: () => ({
        url: PATHS.ALL,
        method: "GET",
      }),
      providesTags: [API_TAGS.CATEGORY],
    }),

    getCategory: build.query<GetCategoryResponse, GetCategoryRequest>({
      query: ({ id }) => ({
        url: PATHS.CATEGORY_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.CATEGORY],
    }),

    updateCategory: build.mutation<
      UpdateCategoryResponse,
      UpdateCategoryRequest
    >({
      query: ({ id, body }) => ({
        url: PATHS.CATEGORY_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),

    deleteCategory: build.mutation<
      DeleteCategoryResponse,
      DeleteCategoryRequest
    >({
      query: ({ id }) => ({
        url: PATHS.CATEGORY_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetAllCategoriesQuery,
  useGetCategoryQuery,
  useLazyGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
