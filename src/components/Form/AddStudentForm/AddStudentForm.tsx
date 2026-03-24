import { useAddStudentsGroupMutation, useGetAllStudentsQuery } from "@/app/api";
import { DatePicker } from "@/components/DatePicker";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Status } from "@/constants";
import { useHandleRequest } from "@/hooks";
import { useAddStudentValidation } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FormValues } from "./types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const AddStudentForm = ({
  groupId,
  onClose,
}: {
  groupId: string;
  onClose: () => void;
}) => {
  const addStudentValidation = useAddStudentValidation();

  const { t } = useTranslation("", {
    keyPrefix: "groups.group.menu.add_new_student",
  });
  const handleRequest = useHandleRequest();
  const [selectedStudents, setSelectedStudents] = useState<
    { fullName: string; _id: string }[]
  >([]);
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const { data: { students } = {} } = useGetAllStudentsQuery({
    branchId: branch,
    status: Status.ACTIVE,
    page: 1,
    perPage: 20,
  });
  const { data: { students: groupStudents } = {} } = useGetAllStudentsQuery({
    branchId: branch,
    status: Status.ACTIVE,
    groupId: groupId,
  });

  const [addStudentsGroup, { isLoading: isAdding }] =
    useAddStudentsGroupMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(addStudentValidation),
    defaultValues: {
      student_select: [],
      student_date: "",
    },
  });

  const onSubmit = async (formValues: FormValues) => {
    await handleRequest({
      request: async () => {
        if (groupId) {
          const result = await addStudentsGroup({
            id: groupId,
            body: {
              students: formValues.student_select,
              startDate: formValues.student_date,
            },
          }).unwrap();
          return result;
        }
      },
      onSuccess: () => {
        onClose();
        toast.success(`${t("toast")}`);
      },
    });
  };

  useEffect(() => {
    if (
      students &&
      groupStudents &&
      students.length > 0 &&
      groupStudents.length > 0
    ) {
      const newStudents = students
        ?.map((el) => ({
          fullName: el.fullName,
          _id: el._id,
        }))
        .filter((el) => !groupStudents.find((i) => i._id === el._id));
      setSelectedStudents(newStudents);
    }
  }, [students, groupStudents]);

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
          name="student_select"
          control={control}
          render={({ field }) => (
            <Autocomplete
              sx={{ width: "100%" }}
              multiple
              id="checkboxes-tags-demo"
              options={selectedStudents || []}
              onChange={(_, val) => field.onChange(val.map((i) => i._id))}
              disableCloseOnSelect
              getOptionLabel={(option) => option.fullName}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.fullName}
                  </li>
                );
              }}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  sx={{ width: "100%" }}
                  {...params}
                  label={t("students_label")}
                  placeholder={t("students_placeholder")}
                  error={!!errors.student_select}
                  helperText={errors.student_select?.message}
                />
              )}
            />
          )}
        />
        <Controller
          name="student_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label={t("date_picker")}
              onChange={(item) =>
                field.onChange(dayjs(item).format("YYYY-MM-DD"))
              }
              value={dayjs(field.value)}
              error={!!errors.student_date}
              helperText={errors.student_date?.message}
            />
          )}
        />
        <Button
          disabled={isAdding}
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isAdding ? (
            <CircularProgress size={"1.5rem"} sx={{ color: "#fff" }} />
          ) : (
            `${t("button")}`
          )}
        </Button>
      </Box>
    </form>
  );
};
