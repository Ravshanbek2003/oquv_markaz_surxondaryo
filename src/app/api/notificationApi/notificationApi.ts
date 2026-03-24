import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddNotificationRequest,
  AddNotificationResponse,
  DeleteNotificationRequest,
  DeleteNotificationResponse,
  GetAllNotificationsRequest,
  GetAllNotificationsResponse,
  GetNotificationRequest,
  GetNotificationResponse,
  UpdateNotificationRequest,
  UpdateNotificationResponse,
} from "./types";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addNotification: build.mutation<
      AddNotificationResponse,
      AddNotificationRequest
    >({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.NOTIFICATION],
    }),

    getAllNotifications: build.query<
      GetAllNotificationsResponse,
      GetAllNotificationsRequest
    >({
      query: ({ type, id }) => ({
        url: `${PATHS.ALL}?type=${type}&branch=${id}`,
        method: "GET",
      }),
      providesTags: [API_TAGS.NOTIFICATION],
    }),

    getNotification: build.query<
      GetNotificationResponse,
      GetNotificationRequest
    >({
      query: ({ id }) => ({
        url: PATHS.NOTIFICATION_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.NOTIFICATION],
    }),

    updateNotification: build.mutation<
      UpdateNotificationResponse,
      UpdateNotificationRequest
    >({
      query: ({ id, body }) => ({
        url: PATHS.NOTIFICATION_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.NOTIFICATION],
    }),

    deleteNotification: build.mutation<
      DeleteNotificationResponse,
      DeleteNotificationRequest
    >({
      query: ({ id }) => ({
        url: PATHS.NOTIFICATION_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.NOTIFICATION],
    }),
  }),
});

export const {
  useAddNotificationMutation,
  useGetAllNotificationsQuery,
  useGetNotificationQuery,
  useLazyGetNotificationQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;
