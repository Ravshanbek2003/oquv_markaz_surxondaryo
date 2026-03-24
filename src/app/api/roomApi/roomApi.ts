import {
  AddRoomRequest,
  AddRoomResponse,
  DeleteRoomRequest,
  DeleteRoomResponse,
  GetAllRoomsRequest,
  GetAllRoomsResponse,
  GetRoomRequest,
  GetRoomResponse,
  UpdateRoomRequest,
  UpdateRoomResponse,
} from "./types";
import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";

export const roomApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addRoom: build.mutation<AddRoomResponse, AddRoomRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.ROOM],
    }),

    getAllRooms: build.query<GetAllRoomsResponse, GetAllRoomsRequest>({
      query: ({ branchID }) => ({
        url: `${PATHS.ALL}?branch=${branchID}`,
        method: "GET",
      }),
      providesTags: [API_TAGS.ROOM],
    }),

    getRoom: build.query<GetRoomResponse, GetRoomRequest>({
      query: ({ id }) => ({
        url: PATHS.ROOM_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.ROOM],
    }),

    updateRoom: build.mutation<UpdateRoomResponse, UpdateRoomRequest>({
      query: ({ id, body }) => ({
        url: PATHS.ROOM_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.ROOM],
    }),

    deleteRoom: build.mutation<DeleteRoomResponse, DeleteRoomRequest>({
      query: ({ id }) => ({
        url: PATHS.ROOM_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.ROOM],
    }),
  }),
});

export const {
  useAddRoomMutation,
  useGetAllRoomsQuery,
  useGetRoomQuery,
  useLazyGetRoomQuery,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
