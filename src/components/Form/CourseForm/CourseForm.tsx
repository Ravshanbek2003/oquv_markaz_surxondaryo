import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useValidationSchema } from "@/validations";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { FormValue, Props } from "./types";
import { FileUploader } from "@/components/FileUploader";
import {
  useAddCourseMutation,
  useLazyGetCourseQuery,
  useUpdateCourseMutation,
} from "@/app/api/courseApi";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useUploadImageMutation } from "@/app/api/uploadApi/uploadApi";
import { useSelector } from "react-redux";
import { formatAmountForm, resetAmountForm } from "@/utils";
import { useTranslation } from "react-i18next";
import { useCourseValidation } from "@/validations";
export const CourseForm = ({ onClose, courseId }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.office.add_course.form",
  });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  // const courseValidation = useValidationSchema();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: yupResolver(useCourseValidation()),
    defaultValues: {
      course_name: "",
      course_img: "",
      course_description: "",
      course_duration: "",
      course_price: "",
      lesson_duration: "",
    },
  });

  const [addCourse, { isLoading: isAdding }] = useAddCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [getCourse, { data: course }] = useLazyGetCourseQuery();
  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadImageMutation();
  const handleRequest = useHandleRequest();
  const onSubmit = async (formValues: FormValue) => {
    const courseImage = new FormData();
    if (
      typeof formValues.course_img === "object" &&
      formValues.course_img instanceof File
    ) {
      courseImage.append("file", formValues.course_img);
    } else if (typeof formValues.course_img === "string") {
      console.warn("Image is already uploaded. URL:", formValues.course_img);
    } else {
      throw new Error("Invalid course_img value.");
    }
    await handleRequest({
      request: async () => {
        if (courseId) {
          const result = await updateCourse({
            id: courseId,
            body: {
              title: formValues.course_name,
              image:
                typeof formValues.course_img === "string"
                  ? formValues.course_img
                  : (
                      await uploadImage(courseImage).unwrap()
                    )?.url,
              lessonDuration: Number(formValues.lesson_duration),
              duration: Number(formValues.course_duration),
              price: Number(formValues.course_price),
              description: formValues.course_description,
            },
          }).unwrap();
          return result;
        }

        const courseImageRes = await uploadImage(courseImage).unwrap();
        const result = await addCourse({
          branch: branch,
          title: formValues.course_name,
          image: courseImageRes?.url,
          lessonDuration: Number(formValues.lesson_duration),
          duration: Number(formValues.course_duration),
          price: Number(formValues.course_price),
          description: formValues.course_description as string,
        }).unwrap();

        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(courseId ? t("toast.title_1") : t("toast.title_2"));
      },
    });
  };
  useEffect(() => {
    if (courseId && getCourse) {
      getCourse({ id: courseId });
    }
  }, [courseId]);
  useEffect(() => {
    if (course) {
      setValue("course_name", course.title);
      setValue("course_img", course.image);
      setValue("lesson_duration", String(course.lessonDuration));
      setValue("course_duration", String(course.duration));
      setValue("course_price", String(course.price));
      setValue("course_description", course.description);
    }
  }, [course, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          gap: 2,
        }}
      >
        <Controller
          name="course_name"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("course_name")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.course_name}
              helperText={errors.course_name?.message}
            />
          )}
        />
        <Controller
          name="course_img"
          control={control}
          render={({ field }) => (
            <FileUploader
              fullWidth
              value={field?.value}
              onChange={field.onChange}
              error={!!errors.course_img}
              helperText={errors.course_img?.message}
              buttonSx={{ py: 1.8 }}
              isShowImg={true}
            />
          )}
        />

        <Controller
          name="lesson_duration"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("lesson_duration_min")}
              variant="outlined"
              fullWidth
              type="number"
              onChange={field.onChange}
              value={field.value}
              error={!!errors.lesson_duration}
              helperText={errors.lesson_duration?.message}
            />
          )}
        />
        <Controller
          name="course_duration"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("lesson_duration_month")}
              variant="outlined"
              fullWidth
              type="number"
              onChange={field.onChange}
              value={field.value}
              error={!!errors.course_duration}
              helperText={errors.course_duration?.message}
            />
          )}
        />
        <Controller
          name="course_price"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("course_price")}
              variant="outlined"
              fullWidth
              type="text"
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                const cleanedValue = resetAmountForm(input.value);
                const formattedValue = formatAmountForm(cleanedValue);
                field.onChange(cleanedValue);
                input.value = formattedValue;
              }}
              value={formatAmountForm(field.value)}
              error={!!errors.course_price}
              helperText={errors.course_price?.message}
            />
          )}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            gap: 2,
          }}
        >
          <Controller
            name="course_description"
            control={control}
            render={({ field }) => (
              <TextField
                label={t("description")}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                onChange={field.onChange}
                value={field.value}
                error={!!errors.course_description}
                helperText={errors.course_description?.message}
              />
            )}
          />
        </Box>

        <Button
          disabled={isAdding || isUpdating || isUploadingImage}
          autoFocus
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isAdding || isUpdating || isUploadingImage ? (
            <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
          ) : courseId ? (
            t("button.title_1")
          ) : (
            t("button.title_2")
          )}
        </Button>
      </Box>
    </form>
  );
};
