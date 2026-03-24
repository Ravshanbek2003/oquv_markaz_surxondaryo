/* eslint-disable @typescript-eslint/no-empty-object-type */
import { PaymentMethod } from "@/constants";

export type Category = {
  _id: string;
  title: string;
};

export type Employee = {
  _id: string;
  fullName: string;
};

export type Payer = {
  _id: string;
  fullName: string;
};

export type Expense = {
  _id: string;
  description: string;
  date: string;
  category: Category;
  employee: Employee;
  payer: Payer;
  branch: string;
  amount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
};

export interface AddExpenseRequest {
  description: string;
  date: string;
  category: string;
  employee: string;
  branch: string;
  amount: number;
  paymentMethod: PaymentMethod;
}
export interface AddExpenseResponse {
  msg: string;
}

export interface GetAllExpensesRequest {
  branchId: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}
export interface GetAllExpensesResponse {
  expenses: Expense[];
}

export interface GetExpenseRequest {
  id: string;
}
export interface GetExpenseResponse extends Expense {}

export interface UpdateExpenseRequest {
  id: string;
  body: Partial<{
    description: string;
    date: string;
    category: string;
    paymentMethod: PaymentMethod;
  }>;
}
export interface UpdateExpenseResponse {
  msg: string;
}

export interface DeleteExpenseRequest {
  id: string;
}
export interface DeleteExpenseResponse {
  msg: string;
}
