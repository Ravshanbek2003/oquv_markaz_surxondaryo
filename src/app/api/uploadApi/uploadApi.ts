import { baseApi } from "../baseApi";
import { PATHS } from "./path";
import { UploadImageRequest, UploadImageResponse } from "./types";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadImage: build.mutation<UploadImageResponse, UploadImageRequest>({
      query: (file) => ({
        url: PATHS.UPLOAD,
        method: "POST",
        body: file,
      }),
    }),
  }),
});
export const { useUploadImageMutation } = uploadApi;
