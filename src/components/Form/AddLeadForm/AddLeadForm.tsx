/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { AddLeadFormValue, useAddLeadValidation } from "@/validations";
import { SingleSelect } from "@/components/SingleSelect";
import { Props } from "./types";
import {
  useAddLeadMutation,
  useGetAllSectionsQuery,
  useGetAllSourcesQuery,
  useLazyGetLeadQuery,
  useUpdateLeadMutation,
} from "@/app/api";
import { useHandleRequest } from "@/hooks";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  formatUzbekPhoneNumber,
  unformatUzbekPhoneNumber,
} from "@/utils/formatUzbekPhoneNumber";
import { useTranslation } from "react-i18next";

export const AddLeadForm = ({ id, onClose }: Props) => {
  const addLeadValidation = useAddLeadValidation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddLeadFormValue>({
    resolver: yupResolver(addLeadValidation),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      fromWhere: "",
      section: "",
    },
  });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const [addLead, { isLoading: isAdding }] = useAddLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [getLead, { data: lead }] = useLazyGetLeadQuery();
  const { data: { sections } = {} } = useGetAllSectionsQuery({ branch });
  const { data: { sources } = {} } = useGetAllSourcesQuery("");
  const handleRequest = useHandleRequest();

  const onSubmit = async (formValues: AddLeadFormValue) => {
    await handleRequest({
      request: async () => {
        if (id) {
          const result = await updateLead({
            id,
            body: {
              fullName: formValues.fullName,
              phoneNumber: unformatUzbekPhoneNumber(formValues.phoneNumber),
              source: formValues.fromWhere || undefined,
              section: formValues.section,
            },
          }).unwrap();
          return result;
        }

        const result = await addLead({
          branch,
          fullName: formValues.fullName,
          phoneNumber: unformatUzbekPhoneNumber(formValues.phoneNumber),
          source: formValues.fromWhere as string,
          section: formValues.section,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(
          id ? "Lead updated successfully" : "Lead created successfully"
        );
      },
    });
  };

  useEffect(() => {
    if (id && getLead) {
      getLead({ id });
    }
  }, [getLead, id]);

  useEffect(() => {
    if (lead) {
      setValue("fullName", lead.fullName);
      setValue("phoneNumber", formatUzbekPhoneNumber(lead.phoneNumber));
      setValue("fromWhere", lead.source._id);
      setValue("section", lead.section._id);
    }
  }, [lead, setValue]);

  const { t } = useTranslation("", { keyPrefix: "leads.add_lead" });

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
          name="fullName"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("form.name_label")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("form.phone_number")}
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
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
          )}
        />
        <Controller
          name="fromWhere"
          control={control}
          render={({ field }) => (
            <SingleSelect
              options={
                sources?.map((el) => ({
                  label: el.title,
                  value: el._id,
                })) || []
              }
              label={t("form.form_where")}
              onChange={field.onChange}
              value={field.value as any}
              error={!!errors.fromWhere}
              helperText={errors.fromWhere?.message}
            />
          )}
        />
        <Controller
          name="section"
          control={control}
          render={({ field }) => (
            <SingleSelect
              options={
                sections?.map((el) => ({
                  label: el.title,
                  value: el._id,
                })) || []
              }
              label={t("form.section")}
              onChange={field.onChange}
              value={field.value as any}
              error={!!errors.section}
              helperText={errors.section?.message}
            />
          )}
        />
        <Button
          disabled={isAdding || isUpdating}
          autoFocus
          variant="contained"
          type="submit"
          sx={{ py: 1 }}
        >
          {isAdding || isUpdating ? (
            <CircularProgress sx={{ color: "white" }} size={"1.5rem"} />
          ) : id ? (
            `${t("title.title_1")}`
          ) : (
            `${t("title.title_3")}`
          )}
        </Button>
      </Box>
    </form>
  );
};
