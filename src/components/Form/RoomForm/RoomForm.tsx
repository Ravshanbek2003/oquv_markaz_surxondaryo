/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useHandleRequest } from "@/hooks";
import {
  useAddRoomMutation,
  useLazyGetRoomQuery,
  useUpdateRoomMutation,
} from "@/app/api";
import toast from "react-hot-toast";
import { FormValue, Props } from "./types";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export const RoomForm = ({ onClose, roomId }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.office.add_room.form",
  });

  const roomValidation = useMemo(() => {
    return yup.object({
      room_name: yup.string().required(t("room_required")),
    });
  }, [roomId]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: yupResolver(roomValidation),
    defaultValues: {
      room_name: "",
    },
  });

  const [addRoom, { isLoading: isAdding }] = useAddRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [getRoom, { data: room }] = useLazyGetRoomQuery();
  const { branch } = useSelector((state: any) => state.branch);
  const handleRequest = useHandleRequest();

  const onSubmit = async (formValues: FormValue) => {
    await handleRequest({
      request: async () => {
        if (roomId) {
          const result = await updateRoom({
            id: roomId,
            body: { title: formValues.room_name },
          }).unwrap();
          return result;
        }
        const result = await addRoom({
          title: formValues.room_name,
          branch: branch,
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        onClose();
        toast.success(
          roomId ? `${t("toast.title_1")}` : `${t("toast.title_2")}`
        );
      },
    });
  };

  useEffect(() => {
    if (roomId && getRoom) {
      getRoom({ id: roomId });
    }
  }, [roomId]);

  useEffect(() => {
    if (room) {
      setValue("room_name", room.title);
    }
  }, [room, setValue]);

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
          name="room_name"
          control={control}
          render={({ field }) => (
            <TextField
              label={t("room_name")}
              variant="outlined"
              fullWidth
              onChange={field.onChange}
              value={field.value}
              error={!!errors.room_name}
              helperText={errors.room_name?.message}
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
            <CircularProgress sx={{ color: "#fff" }} size={"1.5rem"} />
          ) : roomId ? (
            `${t("button.title_1")}`
          ) : (
            `${t("button.title_2")}`
          )}
        </Button>
      </Box>
    </form>
  );
};
