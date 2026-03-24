/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { studentValidationType, useStudentValidation } from "@/validations";
import { SingleSelect } from "@/components/SingleSelect";
import { DatePicker } from "@/components/DatePicker";
import { Gender, useGender } from "@/constants";
import {
  useAddStudentMutation,
  useGetAllGroupsQuery,
  useLazyGetStudentQuery,
  useUpdateStudentMutation,
} from "@/app/api";
import { useSelector } from "react-redux";
import { useHandleRequest } from "@/hooks";
import { Props } from "./types";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useEffect } from "react";
import {
  formatUzbekPhoneNumber,
  unformatUzbekPhoneNumber,
} from "@/utils/formatUzbekPhoneNumber";
import { useTranslation } from "react-i18next";

export const StudentForm = ({ onClose, studentId }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "students.add_modal.form" });
  const GENDERS = useGender();
  const studentValidation = useStudentValidation(studentId);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<studentValidationType>({
    resolver: yupResolver(studentValidation),
    defaultValues: {
      full_name: "",
      parent_phone_number: "",
      phone_number: "",
      group: "",
      gender: "",
      birth_date: "",
      start_date_from: "",
    },
  });
  const { branch } = useSelector((state: any) => state.branch);
  const { data: { groups } = {} } = useGetAllGroupsQuery({ branch });
  const [addStudent, { isLoading: isAddingStudent }] = useAddStudentMutation();
  const [updateStudent, { isLoading: isUpdatingStudent }] =
    useUpdateStudentMutation();
  const [getStudent, { data: student }] = useLazyGetStudentQuery();

  const handleRequest = useHandleRequest();

  const onSubmit = async (formValues: studentValidationType) => {
    await handleRequest({
      request: async () => {
        if (studentId) {
          const result = await updateStudent({
            id: studentId,
            body: {
              fullName: formValues.full_name,
              phoneNumber: unformatUzbekPhoneNumber(formValues.phone_number),
              gender: formValues.gender as Gender,
              parentPhone: unformatUzbekPhoneNumber(
                formValues.parent_phone_number as string
              ),
              birthday: dayjs(formValues.birth_date).format("YYYY-MM-DD"),
            },
          }).unwrap();
          return result;
        }

        const result = await addStudent({
          fullName: formValues.full_name,
          phoneNumber: unformatUzbekPhoneNumber(formValues.phone_number),
          group: formValues.group || undefined,
          gender: formValues.gender as string,
          parentPhone: formValues.parent_phone_number
            ? unformatUzbekPhoneNumber(formValues.parent_phone_number as string)
            : undefined,
          birthday: formValues.birth_date
            ? dayjs(formValues.birth_date).format("YYYY-MM-DD")
            : undefined,
          startDate: formValues.start_date_from
            ? dayjs(formValues.start_date_from).format("YYYY-MM-DD")
            : undefined,
          branch,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(
          studentId ? `${t("toast.title_1")}` : `${t("toast.title_2")}`
        );
      },
    });
  };

  useEffect(() => {
    if (studentId && getStudent) {
      getStudent({ id: studentId });
    }
  }, [getStudent, studentId]);

  useEffect(() => {
    if (student) {
      setValue("full_name", student.fullName);
      setValue("phone_number", formatUzbekPhoneNumber(student.phoneNumber));
      setValue(
        "parent_phone_number",
        formatUzbekPhoneNumber(student.parentPhone)
      );
      setValue("birth_date", student.birthday);
      setValue("gender", student.gender);
    }
  }, [setValue, student]);

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: 2,
          }}
        >
          <Controller
            name="birth_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label={t("data_picker")}
                onChange={field.onChange}
                value={dayjs(field.value)}
                error={!!errors.birth_date}
                helperText={errors.birth_date?.message}
              />
            )}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <SingleSelect
                options={GENDERS}
                label={t("gender_label")}
                onChange={field.onChange}
                value={field.value as any}
                error={!!errors.gender}
                helperText={errors.gender?.message}
              />
            )}
          />
        </Box>
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
          name="parent_phone_number"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("parent_phone_number")}
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
              error={!!errors.parent_phone_number}
              helperText={errors.parent_phone_number?.message}
            />
          )}
        />
        {!studentId && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: 2,
            }}
          >
            <Controller
              name="group"
              control={control}
              render={({ field }) => (
                <SingleSelect
                  options={
                    groups?.map((group) => ({
                      label: group.name,
                      value: group._id,
                    })) || []
                  }
                  label={t("select_group")}
                  onChange={field.onChange}
                  error={!!errors.group}
                  helperText={errors.group?.message}
                />
              )}
            />
            <Controller
              name="start_date_from"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label={t("data_from")}
                  onChange={field.onChange}
                  value={dayjs(field.value)}
                  error={!!errors.start_date_from}
                  helperText={errors.start_date_from?.message}
                />
              )}
            />
          </Box>
        )}
        <Button
          disabled={isAddingStudent || isUpdatingStudent}
          autoFocus
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isAddingStudent || isUpdatingStudent ? (
            <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
          ) : studentId ? (
            `${t("button.title_1")}`
          ) : (
            `${t("button.title_2")}`
          )}
        </Button>
      </Box>
    </form>
  );
};
