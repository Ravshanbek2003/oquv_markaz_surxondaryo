import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FormValue, Props } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGroupValidation } from "@/validations";
import { SingleSelect } from "@/components/SingleSelect";
import { DAYS, Role } from "@/constants";
import { DatePicker } from "@/components/DatePicker";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useHandleRequest } from "@/hooks";
import {
  useAddGroupMutation,
  useGetAllRoomsQuery,
  useGetAllStaffsQuery,
  useLazyGetGroupQuery,
  useSectionToGroupMutation,
  useUpdateGroupMutation,
} from "@/app/api";
import toast from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useEffect, useState } from "react";
import { useGetAllCoursesQuery } from "@/app/api/courseApi";
import { useTranslation } from "react-i18next";
export const GroupForm = ({
  onClose,
  groupId,
  isLeadSection,
  sectionId,
}: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "leads.card.section_card.add_group.form",
  });

  const groupValidation = useGroupValidation();

  const [selectDays, setSelectdays] = useState<
    { label: string; isChecked: boolean; id: number }[]
  >([
    { label: `${t("days.sunday")}`, isChecked: false, id: 0 },
    { label: `${t("days.monday")}`, isChecked: false, id: 1 },
    { label: `${t("days.tuesday")}`, isChecked: false, id: 2 },
    { label: `${t("days.wednesday")}`, isChecked: false, id: 3 },
    { label: `${t("days.thursday")}`, isChecked: false, id: 4 },
    { label: `${t("days.friday")}`, isChecked: false, id: 5 },
    { label: `${t("days.saturday")}`, isChecked: false, id: 6 },
  ]);

  const handleRequest = useHandleRequest();
  const BRANCH = useSelector(
    (state: { branch: { branch: string } }) => state.branch.branch
  );

  const { data: { courses } = {} } = useGetAllCoursesQuery({
    branchID: BRANCH,
  });
  const { data: { rooms } = {} } = useGetAllRoomsQuery({
    branchID: BRANCH,
  });
  const { data: { staff } = {} } = useGetAllStaffsQuery({
    branchId: BRANCH,
    role: Role.TEACHER,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: yupResolver(groupValidation),
    defaultValues: {
      group_name: "",
      start_time: 0,
      group_start_date: "",
      group_end_date: "",
      days: [],
      course: "",
      teacher: "",
      room: "",
    },
  });
  const [getGroup, { data: group } = {}] = useLazyGetGroupQuery();
  useEffect(() => {
    if (groupId && getGroup) {
      getGroup({ id: groupId });
    }
  }, [groupId]);

  useEffect(() => {
    if (group) {
      setValue("group_name", group.name);
      setValue("start_time", group.startTime);
      setValue("group_start_date", group.startDate);
      setValue("group_end_date", group.endDate);
      setValue("days", group.days);
      setValue("course", group?.course?._id);
      setValue("teacher", group?.teacher?._id);
      setValue("room", group?.room?._id);

      group.days?.forEach((day) => {
        setSelectdays((prev) => {
          return prev.map((el) => {
            if (el.id === day) {
              return { ...el, isChecked: true };
            }
            return el;
          });
        });
      });
    }
  }, [group]);
  const [addGroup, { isLoading: isAddingGroup }] = useAddGroupMutation();
  const [sectionToGroup, { isLoading: isSectionToGroup }] =
    useSectionToGroupMutation();
  const [updateGroup, { isLoading: isUpdatingLoading }] =
    useUpdateGroupMutation();

  const onSubmit = async (formValues: FormValue) => {
    await handleRequest({
      request: async () => {
        if (isLeadSection && sectionId) {
          const result = await sectionToGroup({
            id: sectionId,
            body: {
              name: formValues.group_name,
              course: formValues?.course,
              teacher: formValues?.teacher,
              room: formValues?.room,
              days:
                formValues.days.length === 0
                  ? selectDays.filter((el) => el.isChecked).map((el) => el.id)
                  : formValues.days.sort((a, b) => a - b),
              startTime: formValues.start_time,
              startDate: formValues.group_start_date,
              endDate: formValues.group_end_date,
            },
          }).unwrap();
          return result;
        }
        if (groupId) {
          const result = await updateGroup({
            id: groupId,
            body: {
              name: formValues.group_name,
              course: formValues?.course,
              teacher: formValues?.teacher,
              room: formValues?.room,
              days: selectDays.filter((el) => el.isChecked).map((el) => el.id),
              startTime: formValues.start_time,
              startDate: formValues.group_start_date,
              endDate: formValues.group_end_date,
            },
          }).unwrap();
          return result;
        }
        const result = await addGroup({
          name: formValues.group_name,
          branch: BRANCH,
          course: formValues?.course,
          teacher: formValues?.teacher,
          room: formValues?.room,
          days:
            formValues.days.length === 0
              ? selectDays.filter((el) => el.isChecked).map((el) => el.id)
              : formValues.days.sort((a, b) => a - b),
          startTime: formValues.start_time,
          startDate: formValues.group_start_date,
          endDate: formValues.group_end_date,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(
          groupId ? `${t("toast.title_1")}` : `${t("toast.title_2")}`
        );
      },
    });
  };

  const handleDays = ({ value }: { value: string }) => {
    let updatedSelectDays = [...selectDays];
    if (value === "odd_days") {
      updatedSelectDays = updatedSelectDays.map((el, index) => ({
        ...el,
        isChecked: index === 1 || index === 3 || index === 5,
      }));
    } else if (value === "even_days") {
      updatedSelectDays = updatedSelectDays.map((el, index) => ({
        ...el,
        isChecked: index === 2 || index === 4 || index === 6,
      }));
    } else if (value === "weekends") {
      updatedSelectDays = updatedSelectDays.map((el, index) => ({
        ...el,
        isChecked: index === 0 || index === 6,
      }));
    } else if (value === "days.") {
      updatedSelectDays = updatedSelectDays.map((el, index) => ({
        ...el,
        isChecked: index !== 0,
      }));
    } else if (value === "custom") {
      updatedSelectDays = updatedSelectDays.map((el) => ({
        ...el,
        isChecked: false,
      }));
      if (groupId && group) {
        group?.days?.forEach((day) => {
          updatedSelectDays = updatedSelectDays.map((el) => {
            if (el.id === day) {
              return { ...el, isChecked: true };
            }
            return el;
          });
        });
      }
    }
    setSelectdays(updatedSelectDays);
    return updatedSelectDays.filter((el) => el.isChecked).map((el) => el.id);
  };
  const transformFieldValue = (value: number[]) => {
    if (value.length === 0) return "custom";
    const joinedValue = value.join(",");
    switch (joinedValue) {
      case "1,3,5":
        return "odd_days";
      case "2,4,6":
        return "even_days";
      case "0,6":
        return "weekends";
      case "1,2,3,4,5,6":
        return "everyday";
      default:
        return "custom";
    }
  };

  const days = watch("days");

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
          name="group_name"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("group_name")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.group_name}
              helperText={errors.group_name?.message}
            />
          )}
        />

        <Controller
          name="course"
          control={control}
          render={({ field }) => (
            <SingleSelect
              options={
                courses?.map((el) => {
                  return { label: el.title, value: el._id };
                }) || []
              }
              label={t("select_course")}
              onChange={(selectedOption) => field.onChange(selectedOption)}
              value={field.value ? [field.value] : []}
              error={!!errors.course}
              helperText={errors.course?.message}
            />
          )}
        />

        <Controller
          name="teacher"
          control={control}
          render={({ field }) => (
            <SingleSelect
              options={
                staff?.map((el) => ({ label: el?.fullName, value: el?._id })) ||
                []
              }
              label={t("select_teacher")}
              onChange={field.onChange}
              value={field.value.length > 0 ? [field.value] : []}
              error={!!errors.teacher}
              helperText={errors.teacher?.message}
            />
          )}
        />
        <Controller
          name="start_time"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                onChange={(newValue) =>
                  field.onChange(
                    Number(newValue?.get("hours") || 0) * 60 +
                      Number(newValue?.get("minutes") || 0)
                  )
                }
                value={dayjs(
                  new Date().setHours(
                    Math.floor(field.value / 60),
                    field.value % 60
                  )
                )}
                label={t("start_time")}
                ampm={false}
              />
            </LocalizationProvider>
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
            name="days"
            control={control}
            render={({ field }) => (
              <SingleSelect
                options={DAYS}
                label={t("select_days")}
                onChange={(selected) =>
                  field.onChange(
                    handleDays({
                      value: selected.target.value,
                    })
                  )
                }
                value={[transformFieldValue(field.value)]}
                error={!!errors.days}
                helperText={errors.days?.message}
              />
            )}
          />

          <Controller
            name="room"
            control={control}
            render={({ field }) => (
              <SingleSelect
                options={
                  rooms?.map((el) => ({ label: el?.title, value: el?._id })) ||
                  []
                }
                label={t("select_room")}
                onChange={field.onChange}
                value={field.value ? [field.value] : []}
                error={!!errors.room}
                helperText={errors.room?.message}
              />
            )}
          />
        </Box>
        {days.join(",") !== "1,3,5" &&
          days.join(",") !== "2,4,6" &&
          days.join(",") !== "0,6" &&
          days.join(",") !== "1,2,3,4,5,6" && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                width: "50%",
                flexWrap: "wrap",
                boxSizing: "border-box",
                paddingX: "10px",
                paddingBottom: "10px",
              }}
            >
              {selectDays.map((el) => (
                <FormControlLabel
                  key={el.id}
                  sx={{ display: "flex", gap: "4px" }}
                  control={
                    <Checkbox
                      checked={el.isChecked}
                      onChange={(e) =>
                        setSelectdays((prev) =>
                          prev.map((element) =>
                            el.id === element.id
                              ? { ...element, isChecked: e.target.checked }
                              : element
                          )
                        )
                      }
                      size="small"
                      sx={{
                        height: "16px",
                        width: "16px",
                        fontWeight: "semibold",
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{ fontSize: "12px", color: "primary.main" }}
                    >
                      {el.label}
                    </Typography>
                  }
                />
              ))}
            </Box>
          )}
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
            name="group_start_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label={t("group_start_date")}
                onChange={(newValue) =>
                  field.onChange(dayjs(newValue).format("YYYY-MM-DD"))
                }
                value={dayjs(field.value)}
                error={!!errors.group_start_date}
                helperText={errors.group_start_date?.message}
              />
            )}
          />
          <Controller
            name="group_end_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label={t("end_date")}
                onChange={(newValue) =>
                  field.onChange(dayjs(newValue).format("YYYY-MM-DD"))
                }
                value={dayjs(field.value)}
                error={!!errors.group_end_date}
                helperText={errors.group_end_date?.message}
              />
            )}
          />
        </Box>
        <Button
          disabled={isAddingGroup || isUpdatingLoading || isSectionToGroup}
          autoFocus
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isAddingGroup || isUpdatingLoading || isSectionToGroup ? (
            <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
          ) : groupId ? (
            `${t("update_group")}`
          ) : (
            `${t("add_group")}`
          )}
        </Button>
      </Box>
    </form>
  );
};
