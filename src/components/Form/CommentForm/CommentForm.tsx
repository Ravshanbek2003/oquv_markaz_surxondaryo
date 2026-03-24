import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CommentType, useCommentValidation } from "@/validations";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import {
  useAddCommentMutation,
  useLazyGetCommentQuery,
  useUpdateCommentMutation,
} from "@/app/api";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { Props } from "./types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const CommentForm = ({ onClose, studentId, commentId }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "students.student.add_modal.form",
  });
  const commentValidation = useCommentValidation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CommentType>({
    resolver: yupResolver(commentValidation),
    defaultValues: {
      comment_text: "",
    },
  });

  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
  const [getComment, { data: comment }] = useLazyGetCommentQuery();
  const handleRequest = useHandleRequest();

  const onSubmit = async (formValues: CommentType) => {
    await handleRequest({
      request: async () => {
        if (commentId) {
          const result = await updateComment({
            commentId,
            body: {
              message: formValues.comment_text,
            },
          }).unwrap();
          return result;
        }

        const result = await addComment({
          message: formValues.comment_text,
          student: studentId,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(commentId ? t("toast.title_1") : t("toast.title_2"));
      },
    });
  };

  useEffect(() => {
    if (commentId && getComment) {
      getComment({ commentId });
    }
  }, [commentId]);

  useEffect(() => {
    if (comment) {
      setValue("comment_text", comment.message);
    }
  }, [comment, setValue]);

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
          name="comment_text"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("comment")}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              onChange={field.onChange}
              value={field.value}
              error={!!errors.comment_text}
              helperText={errors.comment_text?.message}
            />
          )}
        />
        <Button
          disabled={isAdding || isUpdating}
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isAdding || isUpdating ? (
            <CircularProgress sx={{ color: "white" }} size={"1.5rem"} />
          ) : commentId ? (
            t("button.title_1")
          ) : (
            t("button.title_2")
          )}
        </Button>
      </Box>
    </form>
  );
};
