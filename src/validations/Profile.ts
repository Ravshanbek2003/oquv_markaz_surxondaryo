import * as yup from "yup";

export const profileValidation = yup.object({
  fullName: yup.string().optional(),
  avatar: yup.string().optional(),
  telegram: yup.string().optional(),
  oldPassword: yup.string().optional(),
  newPassword: yup.string().optional(),
});

export type profileValidationType = yup.InferType<typeof profileValidation>;
