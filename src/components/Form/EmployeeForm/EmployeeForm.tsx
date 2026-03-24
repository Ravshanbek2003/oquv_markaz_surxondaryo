import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EmployeeType, useEmployeeValidation } from "@/validations";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { PasswordInput } from "@/components/PasswordInput";
import {
  useAddStaffMutation,
  useGetAllBranchesQuery,
  useLazyGetStaffQuery,
  useUpdateStaffMutation,
} from "@/app/api";
import { useHandleRequest } from "@/hooks";
import { Role } from "@/constants";
import { Props, Sizes } from "./types";
import { MultipleSelect } from "@/components/MultipleSelect";
import { useEffect, useState } from "react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { PermissionTable } from "./PermissionTable";
import toast from "react-hot-toast";
import {
  formatUzbekPhoneNumber,
  unformatUzbekPhoneNumber,
} from "@/utils/formatUzbekPhoneNumber";
import { useTranslation } from "react-i18next";

export const EmployeeForm = ({
  onClose,
  setMaxWidth,
  selectedAdminId,
}: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.ceo.add_employee.form",
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EmployeeType>({
    resolver: yupResolver(useEmployeeValidation(selectedAdminId as string)),
    defaultValues: {
      fullname: "",
      password: "",
      phone_number: "",
      telegram_username: "",
      branches: [],
      role: "",
      permissions: [],
    },
  });

  const [addStaff, { isLoading: isAdding }] = useAddStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [getStaff, { data: admin }] = useLazyGetStaffQuery();
  const { data: { branches } = {} } = useGetAllBranchesQuery({});
  const [isPermission, setIsPermission] = useState(false);
  const handleRequest = useHandleRequest();

  const handlePermission = (maxWidth: Sizes) => {
    setIsPermission(!isPermission);
    setMaxWidth?.(maxWidth);
  };

  const handleClose = () => {
    setMaxWidth?.("sm");
    onClose();
  };

  const onSubmit = async (formValues: EmployeeType) => {
    await handleRequest({
      request: async () => {
        if (selectedAdminId) {
          const result = await updateStaff({
            id: selectedAdminId,
            body: {
              fullName: formValues.fullname,
              password: formValues.password,
              phoneNumber: unformatUzbekPhoneNumber(formValues.phone_number),
              branches: formValues.branches,
              permissions: formValues.permissions,
              telegram: formValues.telegram_username,
            },
          }).unwrap();
          return result;
        }

        const result = await addStaff({
          fullName: formValues.fullname,
          password: formValues.password as string,
          phoneNumber: unformatUzbekPhoneNumber(formValues.phone_number),
          branches: formValues.branches,
          permissions: formValues.permissions,
          telegram: formValues.telegram_username,
          role: Role.ADMIN,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        handleClose();
        toast.success(
          selectedAdminId ? t("toast.title_1") : t("toast.title_2")
        );
      },
    });
  };

  useEffect(() => {
    if (selectedAdminId && getStaff) {
      getStaff({ id: selectedAdminId });
    }
  }, [selectedAdminId]);

  useEffect(() => {
    if (admin) {
      setValue("fullname", admin.fullName);
      setValue("password", admin.password as string);
      setValue("telegram_username", admin.telegram as string);
      setValue("phone_number", formatUzbekPhoneNumber(admin.phoneNumber));
      setValue(
        "branches",
        admin.branches.map((branch) => branch._id)
      );
      setValue("permissions", admin.permissions);
    }
  }, [admin, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {!isPermission ? (
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
            name="fullname"
            control={control}
            render={({ field }) => (
              <TextField
                label={t("full_name")}
                variant="outlined"
                fullWidth
                onChange={field.onChange}
                value={field.value}
                error={!!errors.fullname}
                helperText={errors.fullname?.message}
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
                fullWidth
                type="tel"
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
            name="telegram_username"
            control={control}
            render={({ field }) => (
              <TextField
                label={t("tg_username")}
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
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                label={t("password")}
                variant="outlined"
                onChange={field.onChange}
                value={field.value}
                error={!!errors.password}
                helperText={errors.password?.message}
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
                    value: branch._id,
                    label: branch.title,
                  })) || []
                }
                value={field.value}
                error={!!errors.branches}
                helperText={errors.branches?.message}
              />
            )}
          />
          <Box sx={{ width: "100%" }}>
            <Button
              autoFocus
              variant="outlined"
              onClick={() => handlePermission("lg")}
              sx={{ py: 1, width: "100%" }}
              type="button"
              endIcon={<IoChevronForward />}
              color={errors.permissions ? "error" : "primary"}
            >
              {t("permissions")}
            </Button>
            {errors.permissions && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mt: "3px", fontSize: 12, ml: "14px" }}
              >
                {errors.permissions.message}
              </Typography>
            )}
          </Box>
          <Button
            disabled={isAdding || isUpdating}
            autoFocus
            variant="contained"
            type="submit"
            sx={{ py: 1 }}
          >
            {isAdding || isUpdating ? (
              <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
            ) : selectedAdminId ? (
              t("button.title_1")
            ) : (
              t("button.title_2")
            )}
          </Button>
        </Box>
      ) : (
        <Controller
          name="permissions"
          control={control}
          render={({ field }) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "100%",
                  gap: 2,
                }}
              >
                <Button
                  startIcon={<IoChevronBackOutline />}
                  variant="outlined"
                  onClick={() => handlePermission("sm")}
                  sx={{
                    py: 1,
                    width: {
                      xs: "50%",
                      sm: "30%",
                      md: "10%",
                    },
                  }}
                  type="button"
                >
                  {t("back")}
                </Button>
                <PermissionTable
                  onChange={field.onChange}
                  values={field.value}
                  branches={
                    branches?.filter((branch) =>
                      getValues("branches").includes(branch._id)
                    ) || []
                  }
                />
              </Box>
            );
          }}
        />
      )}
    </form>
  );
};
