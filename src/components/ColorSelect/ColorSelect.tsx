/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThemesColor } from "@/constants";
import { Card, CardContent, Stack } from "@mui/material";
import { IoCheckmark } from "react-icons/io5";
import { Props } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/app/slices";

export const ColorSelect = ({ onChange }: Props) => {
  const { theme } = useSelector((state: any) => state.theme);
  const dispatch = useDispatch();

  return (
    <div className="mb-1 mt-2 sm:mb-4 sm:mt-5">
      <Stack gap={2} direction="row">
        {Object.values(ThemesColor).map((item) => (
          <Card
            key={item}
            sx={{
              width: {
                xs: "60px",
                sm: "75px",
              },
              bgcolor: item,
              cursor: "pointer",
              borderRadius: "100%",
              height: {
                xs: "60px",
                sm: "75px",
              },
            }}
            onClick={() => {
              onChange(item);
              dispatch(setTheme(item));
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item === theme && (
                <IoCheckmark className="mt-2 text-white" size={28} />
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </div>
  );
};
