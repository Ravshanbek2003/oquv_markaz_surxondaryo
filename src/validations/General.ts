import * as yup from "yup";

export const generalValidation = yup.object({
  name: yup.string().optional(),
  about: yup.string().optional(),
  color: yup.string().optional(),
  logo: yup.string().optional(),
});

export type generalForm = yup.InferType<typeof generalValidation>;
