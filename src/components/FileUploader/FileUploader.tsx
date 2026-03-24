import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Props } from "./types";
import ImageIcon from "@mui/icons-material/Image";
import { useTranslation } from "react-i18next";

export const FileUploader = ({
  fullWidth = true,
  onChange,
  value,
  error,
  helperText,
  buttonSx,
  isShowImg = false,
}: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.office.add_course.form",
  });
  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const [preview, setPreview] = useState<string | File | FormData | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (isShowImg) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      onChange(file);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        variant="outlined"
        component="label"
        fullWidth={fullWidth}
        sx={{ py: 1, ...(error && { borderColor: "red" }), ...buttonSx }}
      >
        {value ? (
          <Typography variant="body2">Selected file:</Typography>
        ) : (
          <div className="flex items-center gap-2">
            <ImageIcon />
            <p>{t("upload_file")}</p>
          </div>
        )}
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {error && (
        <Typography
          color="error"
          variant="body2"
          sx={{ mt: "3px", fontSize: 12, ml: "14px" }}
        >
          {helperText}
        </Typography>
      )}
      {isShowImg && typeof preview === "string" && preview && (
        <Box
          component="img"
          src={preview}
          alt="Uploaded Preview"
          sx={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "contain",
            mt: 2,
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      )}
    </Box>
  );
};
