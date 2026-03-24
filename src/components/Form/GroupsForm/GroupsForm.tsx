/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  groupsValidationType,
  useGroupsValidation,
} from "@/validations/Groups";
import { Box, Button, CircularProgress } from "@mui/material";
import { SingleSelect } from "@/components/SingleSelect";
import { DatePicker } from "@/components/DatePicker";
import {
  useAddToGroupMutation,
  useGetAllGroupsQuery,
  useLeadToStudentMutation,
} from "@/app/api";
import { useHandleRequest } from "@/hooks";
import { useSelector } from "react-redux";
import { Props } from "./types";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const GroupsForm = ({
  studentId,
  onClose,
  studentGroups,
  isLead = false,
}: Props) => {
  const groupsValidation = useGroupsValidation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<groupsValidationType>({
    resolver: yupResolver(groupsValidation),
    defaultValues: {
      group_date: "",
      group: "",
    },
  });

  const { t } = useTranslation("", {
    keyPrefix: "leads.list.add_group.groups_form",
  });

  const { branch } = useSelector((state: any) => state.branch);
  const [addToGroup, { isLoading: isAdding }] = useAddToGroupMutation();
  const [leadToStudent, { isLoading: isLeadToStudent }] =
    useLeadToStudentMutation();
  const { data: { groups } = {} } = useGetAllGroupsQuery({ branch });
  const handleRequest = useHandleRequest();

  const onSubmit = async (formValues: groupsValidationType) => {
    await handleRequest({
      request: async () => {
        if (isLead) {
          const result = await leadToStudent({
            leadId: studentId,
            body: {
              group: formValues.group,
              startDate: formValues.group_date,
            },
          });
          return result;
        }
        const result = await addToGroup({
          studentId,
          body: {
            action: "add",
            group: formValues.group,
            startDate: formValues.group_date,
          },
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(
          isLead ? `${t("toast.title_1")}` : `${t("toast.title_2")}`
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
        <Box>
          <Controller
            name="group"
            control={control}
            render={({ field }) => (
              <SingleSelect
                label={t("select_group")}
                onChange={field.onChange}
                options={
                  groups
                    ?.filter((group) => !studentGroups.includes(group._id))
                    ?.map((group) => ({
                      label: group.name,
                      value: group._id,
                    })) || []
                }
                error={!!errors.group}
                helperText={errors.group?.message}
              />
            )}
          />
        </Box>
        <Box>
          <Controller
            name="group_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label={t("date_form")}
                onChange={(item) =>
                  field.onChange(dayjs(item).format("YYYY-MM-DD"))
                }
                value={dayjs(field.value)}
                error={!!errors.group_date}
                helperText={errors.group_date?.message}
              />
            )}
          />
        </Box>
        <Button
          disabled={isAdding || isLeadToStudent}
          autoFocus
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isAdding || isLeadToStudent ? (
            <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
          ) : (
            `${t("add_group")}`
          )}
        </Button>
      </Box>
    </form>
  );
};
