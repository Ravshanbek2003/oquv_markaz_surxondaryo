import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddCommentRequest,
  AddCommentResponse,
  DeleteCommentRequest,
  DeleteCommentResponse,
  GetAllCommentsRequest,
  GetAllCommentsResponse,
  GetCommentRequest,
  GetCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from "./types";

export const CommentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addComment: build.mutation<AddCommentResponse, AddCommentRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.COMMENT],
    }),

    getAllComments: build.query<GetAllCommentsResponse, GetAllCommentsRequest>({
      query: ({ studentId }) => ({
        url: `${PATHS.ALL}?student=${studentId}`,
        method: "GET",
      }),
      providesTags: [API_TAGS.COMMENT],
    }),

    getComment: build.query<GetCommentResponse, GetCommentRequest>({
      query: ({ commentId }) => ({
        url: PATHS.COMMENT_ID + commentId,
        method: "GET",
      }),
      providesTags: [API_TAGS.COMMENT],
    }),

    updateComment: build.mutation<UpdateCommentResponse, UpdateCommentRequest>({
      query: ({ commentId, body }) => ({
        url: PATHS.COMMENT_ID + commentId,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.COMMENT],
    }),

    deleteComment: build.mutation<DeleteCommentResponse, DeleteCommentRequest>({
      query: ({ commentId }) => ({
        url: PATHS.COMMENT_ID + commentId,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.COMMENT],
    }),
  }),
});

export const {
  useAddCommentMutation,
  useGetAllCommentsQuery,
  useGetCommentQuery,
  useLazyGetCommentQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = CommentApi;
