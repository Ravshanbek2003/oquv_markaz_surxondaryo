import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
// import { loginValidation } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FormValue } from "./types";
import { useHandleRequest } from "@/hooks";
import { useStorage } from "@/utils";
import {
  LoginResponse,
  useGetSettingsQuery,
  useLoginMutation,
} from "@/app/api";
import {
  formatUzbekPhoneNumber,
  unformatUzbekPhoneNumber,
} from "@/utils/formatUzbekPhoneNumber";
import { useLoginValidation } from "@/validations";

export const LoginForm = () => {
  const loginValidation = useLoginValidation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: yupResolver(loginValidation),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleRequest = useHandleRequest();
  const [login, { isLoading }] = useLoginMutation();

  const { data: settings } = useGetSettingsQuery("");

  const onSubmit = async (data: FormValue) => {
    await handleRequest({
      request: async () => {
        const result = await login({
          ...data,
          phoneNumber: unformatUzbekPhoneNumber(data.phoneNumber),
        }).unwrap();
        return result;
      },
      onSuccess: (loginData: LoginResponse) => {
        useStorage.setCredentials({
          token: loginData?.token,
        });
        window.location.href = "/dashboard";
      },
    });
  };

  return (
    <Card variant="outlined" sx={{ width: 500, padding: 3, paddingBottom: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <img
          alt={settings?.name || "logo"}
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
          src={settings?.logo || "/placeholder.png"}
        />
      </Box>
      <Typography
        variant="h4"
        fontWeight={500}
        sx={{ paddingTop: 2, textAlign: "center" }}
      >
        {settings?.name ? `Welcome to ${settings?.name}` : "Loading..."}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            rowGap: 2,
            paddingTop: 4,
          }}
        >
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                onChange={(e) => {
                  const input = e.target as HTMLInputElement;
                  const cleanedValue = input.value.replace(/\D/g, "");
                  const formattedValue = formatUzbekPhoneNumber(cleanedValue);
                  field.onChange(formattedValue);
                }}
                value={field.value}
                label="Phone Number"
                variant="outlined"
                type="tel"
                fullWidth
                margin="normal"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                onChange={field.onChange}
                value={field.value}
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                sx={{ width: "100%" }}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onClick={() => setShowPassword(!showPassword)}
                name="gilad"
              />
            }
            label="Show Password"
          />
          <Button
            disabled={isLoading}
            type="submit"
            sx={{ width: "100%", paddingY: 2, boxShadow: "none" }}
            variant="contained"
          >
            {isLoading ? (
              <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
            ) : (
              "Login"
            )}
          </Button>
        </Box>
      </form>
    </Card>
  );
};
