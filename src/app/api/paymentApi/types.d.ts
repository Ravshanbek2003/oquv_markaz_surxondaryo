import { PaymentMethod } from "@/constants";

export type Group = {
  _id: string;
  name: string;
};

export type Student = {
  _id: string;
  fullName: string;
  phoneNumber: string;
};

export type Receiver = {
  _id: string;
  fullName: string;
};

export type Payment = {
  _id: string;
  receiver: Receiver;
  group: Group;
  student: Student;
  amount: number;
  date: string;
  method: PaymentMethod;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export interface GetAllPaymentsRequest {
  student: string;
}
export interface GetAllPaymentsResponse {
  payments: Payment[];
}

export interface GetIncomeRequest {
  branch: string;
  group?: string;
  teacher?: string;
  startDate?: string;
  endDate?: string;
}
export interface GetIncomeResponse {
  payments: Payment[];
}

export interface GetExpectedRequest {
  branch: string;
  group?: string;
  teacher?: string;
}
export interface GetExpectedResponse {
  data: {
    [id: string]: {
      expected: number;
      paid: number;
      student: {
        _id: string;
        phoneNumber: string;
        fullName: string;
      };
    };
  };
}

export interface AddPaymentRequest {
  group: string;
  student: string;
  amount: number;
  method?: PaymentMethod;
  date: string;
  comment?: string;
}
export interface AddPaymentResponse {
  msg: string;
}

export interface DeletePaymentRequest {
  id: string;
}
export interface DeletePaymentResponse {
  msg: string;
}
