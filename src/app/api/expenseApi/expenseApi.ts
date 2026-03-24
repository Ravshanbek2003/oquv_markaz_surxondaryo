import { API_TAGS } from "@/constants";
import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import {
  AddExpenseRequest,
  AddExpenseResponse,
  DeleteExpenseRequest,
  DeleteExpenseResponse,
  GetAllExpensesRequest,
  GetAllExpensesResponse,
  GetExpenseRequest,
  GetExpenseResponse,
  UpdateExpenseRequest,
  UpdateExpenseResponse,
} from "./types";

export const expenseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addExpense: build.mutation<AddExpenseResponse, AddExpenseRequest>({
      query: (body) => ({
        url: PATHS.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.EXPENSE],
    }),

    getAllExpenses: build.query<GetAllExpensesResponse, GetAllExpensesRequest>({
      query: ({ branchId, startDate, endDate, employeeId }) => {
        const params = new URLSearchParams({ branch: branchId });
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (employeeId) params.append("employee", employeeId);

        return {
          url: `${PATHS.ALL}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [API_TAGS.EXPENSE],
    }),

    getExpense: build.query<GetExpenseResponse, GetExpenseRequest>({
      query: ({ id }) => ({
        url: PATHS.EXPENSE_ID + id,
        method: "GET",
      }),
      providesTags: [API_TAGS.EXPENSE],
    }),

    updateExpense: build.mutation<UpdateExpenseResponse, UpdateExpenseRequest>({
      query: ({ id, body }) => ({
        url: PATHS.EXPENSE_ID + id,
        method: "PUT",
        body,
      }),
      invalidatesTags: [API_TAGS.EXPENSE],
    }),

    deleteExpense: build.mutation<DeleteExpenseResponse, DeleteExpenseRequest>({
      query: ({ id }) => ({
        url: PATHS.EXPENSE_ID + id,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.EXPENSE],
    }),
  }),
});

export const {
  useAddExpenseMutation,
  useGetAllExpensesQuery,
  useGetExpenseQuery,
  useLazyGetAllExpensesQuery,
  useLazyGetExpenseQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
