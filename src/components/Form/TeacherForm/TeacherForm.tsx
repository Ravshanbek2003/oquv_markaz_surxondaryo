import { Controller, useForm } from "react-hook-form";
import { FormValue, Props } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTeacherValidation } from "@/validations";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { MultipleSelect } from "@/components/MultipleSelect";
import { PasswordInput } from "@/components/PasswordInput";
import {
  useAddStaffMutation,
  useGetAllBranchesQuery,
  useLazyGetStaffQuery,
  useUpdateStaffMutation,
} from "@/app/api";
import { useEffect } from "react";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { Role } from "@/constants";
import {
  formatUzbekPhoneNumber,
  unformatUzbekPhoneNumber,
} from "@/utils/formatUzbekPhoneNumber";
import { useTranslation } from "react-i18next";

export const TeacherForm = ({ teacherId, onClose }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "teachers.teacher_form" });
  const handleRequest = useHandleRequest();
  const [getStaff, { data }] = useLazyGetStaffQuery();
  const [updateStaff, { isLoading: updateLoading }] = useUpdateStaffMutation();
  const [addStaff, { isLoading: addLoading }] = useAddStaffMutation();

  const { data: { branches } = {} } = useGetAllBranchesQuery({});
  useEffect(() => {
    if (teacherId && getStaff) {
      getStaff({ id: teacherId });
    }
  }, [teacherId, getStaff]);

  const teacherValidation = useTeacherValidation(teacherId as string);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: yupResolver(teacherValidation),
    defaultValues: {
      phone_number: "",
      password: "",
      branches: [],
      full_name: "",
      percent: "",
      telegram_username: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("full_name", data.fullName);
      setValue("telegram_username", data.telegram);
      setValue("percent", (data.percent as number)?.toString());
      setValue(
        "branches",
        Array.isArray(data.branches)
          ? data.branches.map((el: { _id: string; title: string }) => el._id)
          : []
      );

      setValue("phone_number", formatUzbekPhoneNumber(data.phoneNumber));
      setValue("password", undefined);
    }
  }, [data, setValue, teacherId]);
  const onSubmit = async (formValues: FormValue) => {
    await handleRequest({
      request: async () => {
        if (teacherId) {
          const result = await updateStaff({
            id: teacherId,
            body: {
              fullName: formValues.full_name,
              phoneNumber: unformatUzbekPhoneNumber(formValues.phone_number),
              branches: formValues.branches,
              password: formValues.password,
              telegram: formValues.telegram_username,
              percent: Number(formValues.percent),
            },
          }).unwrap();
          return result;
        }
        const result = await addStaff({
          fullName: formValues.full_name,
          phoneNumber: unformatUzbekPhoneNumber(formValues.phone_number),
          role: Role.TEACHER,
          branches: formValues.branches,
          password: formValues.password as string,
          telegram: formValues.telegram_username,
          percent: Number(formValues.percent),
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(
          teacherId ? `${t("toast.title_1")}` : `${t("toast.title_2")}`
        );
      },
    });
  };

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
          name="full_name"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("full_name")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
          )}
        />
        <Controller
          name="telegram_username"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("telegram_username")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.telegram_username}
              helperText={errors.telegram_username?.message}
            />
          )}
        />

        <Controller
          name="percent"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("percent")}
              variant="outlined"
              type="number"
              fullWidth
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = Math.max(0, parseInt(input.value) || 0)
                  .toString()
                  .slice(0, 3);
              }}
              onChange={field.onChange}
              value={field.value}
              error={!!errors.percent}
              helperText={errors.percent?.message}
            />
          )}
        />
        <Controller
          name="branches"
          control={control}
          render={({ field }) => (
            <MultipleSelect
              label={t("branches")}
              onChange={field.onChange}
              names={
                branches?.map((branch) => ({
                  label: branch.title,
                  value: branch._id,
                })) || []
              }
              value={field.value}
              error={!!errors.branches}
              helperText={errors.branches?.message}
            />
          )}
        />
        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("phone_number")}
              variant="outlined"
              type="tel"
              fullWidth
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                const cleanedValue = input.value.replace(/\D/g, "");
                const formattedValue = formatUzbekPhoneNumber(cleanedValue);
                field.onChange(formattedValue);
              }}
              value={field.value}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              variant="outlined"
              label={t("password")}
              onChange={field.onChange}
              value={field.value}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />
        <Button
          disabled={updateLoading || addLoading}
          autoFocus
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {updateLoading || addLoading ? (
            <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
          ) : teacherId ? (
            `${t("button.title_1")}`
          ) : (
            `${t("button.title_2")}`
          )}
        </Button>
      </Box>
    </form>
  );
};
