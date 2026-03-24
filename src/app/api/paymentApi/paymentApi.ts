import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddPaymentRequest,
  AddPaymentResponse,
  DeletePaymentRequest,
  DeletePaymentResponse,
  GetAllPaymentsRequest,
  GetAllPaymentsResponse,
  GetExpectedRequest,
  GetExpectedResponse,
  GetIncomeRequest,
  GetIncomeResponse,
} from "./types";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addPayment: build.mutation<AddPaymentResponse, AddPaymentRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.PAYMENT],
    }),

    getAllPayments: build.query<GetAllPaymentsResponse, GetAllPaymentsRequest>({
      query: ({ student }) => ({
        url: `${PATHS.ALL}?student=${student}`,
        method: "GET",
      }),
      providesTags: [API_TAGS.PAYMENT],
    }),

    getPaymentIncome: build.query<GetIncomeResponse, GetIncomeRequest>({
      query: ({ branch, endDate, group, startDate, teacher }) => {
        const params = new URLSearchParams();

        if (endDate) params.append("endDate", endDate);
        if (group) params.append("group", group);
        if (startDate) params.append("startDate", startDate);
        if (teacher) params.append("teacher", teacher);

        return {
          url: `${PATHS.INCOME}?branch=${branch}&${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [API_TAGS.PAYMENT],
    }),
    getPaymentExpected: build.query<GetExpectedResponse, GetExpectedRequest>({
      query: ({ branch, group, teacher }) => {
        const params = new URLSearchParams();

        if (group) params.append("group", group);
        if (teacher) params.append("teacher", teacher);

        return {
          url: `${PATHS.EXPECTED}?branch=${branch}&${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [API_TAGS.PAYMENT],
    }),

    deletePayment: build.mutation<DeletePaymentResponse, DeletePaymentRequest>({
      query: ({ id }) => ({
        url: PATHS.PAYMENT_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.PAYMENT],
    }),
  }),
});

export const {
  useAddPaymentMutation,
  useGetAllPaymentsQuery,
  useGetPaymentIncomeQuery,
  useGetPaymentExpectedQuery,
  useLazyGetPaymentExpectedQuery,
  useLazyGetPaymentIncomeQuery,
  useDeletePaymentMutation,
} = paymentApi;
