import { useHandleRequest } from "../use-handle-request";
import { UploadImageResponse } from "@/app/api/uploadApi/types";
import { useUploadImageMutation } from "@/app/api/uploadApi/uploadApi";
import { acceptedImageFormats } from "@/constants/acceptedImageFormats";

export const useUploadImage = () => {
  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadImageMutation();
  const handleRequest = useHandleRequest();

  return [
    async (file: File) => {
      if (!acceptedImageFormats.includes(file.type)) {
        throw new Error("Fayl formati qabul qilinmaydi!");
      }

      const formData = new FormData();
      formData.append("image", file);

      let filePath = "";

      await handleRequest({
        request: async () => {
          const result = await uploadImage(formData);
          return result;
        },
        onSuccess: (response: UploadImageResponse) => {
          if (response) {
            filePath = response.url;
          }
        },
      });
      return filePath;
    },
    isUploadingImage,
  ] as [(file: File) => Promise<string>, boolean];
};

// import {
//   acceptedImageFormats,
//   acceptedPDFFormats,
//   acceptedVideoFormats,
// } from "@/constants/accepted-image-formats";
// import {
//   useUploadImageMutation,
//   useUploadPDFMutation,
//   useUploadVideoMutation,
// } from "@/features/upload/upload";
// import { asyncForEach } from "@/utils/async-for-each";
// import { useHandleRequest } from "../use-handle-request";
// import { useHandleError } from "../use-handle-error";
// import { UploadImageResponse } from "@/features/upload/types";

// export const useUploadFiles = () => {
//   const [uploadImage, { isLoading: isUploadingImage }] =
//     useUploadImageMutation();
//   const handleRequest = useHandleRequest();
//   const handleError = useHandleError();

//   return [
//     async (files: File[]) => {
//       const filePaths: string[] = [];

//       await asyncForEach(files, async (file: File) => {
//         if (acceptedImageFormats.includes(file.type)) {
//           const formData = new FormData();
//           formData.append("image", file);

//           await handleRequest({
//             request: async () => {
//               const result = await uploadImage(formData);
//               return result;
//             },
//             onSuccess: (response: UploadImageResponse) => {
//               if (response.data) {
//                 filePaths.push(response.data.file_path);
//               }
//             },
//           });
//         }
//       });
//       return filePaths;
//     },
//     isUploadingImage,
//   ] as [(files: File[]) => Promise<string[]>, boolean];
// };
