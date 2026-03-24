import * as yup from "yup";

export const roomValidation = yup.object({
  room_name: yup.string().required("Room name is required"),
  branch: yup.string().required("Branch is required"),
});

export type roomValidationType = yup.InferType<typeof roomValidation>;
