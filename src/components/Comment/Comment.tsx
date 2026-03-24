import React, { useState } from "react";
import TextField from "@mui/material/TextField";

export const Comment: React.FC<Comment> = ({
  errorMessage = "This field is required",
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (event.target.value.trim() === "") {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleBlur = () => {
    if (value.trim() === "") {
      setError(true);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <TextField
        label="Enter comment"
        multiline
        rows={4}
        variant="outlined"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        helperText={error ? errorMessage : ""}
        fullWidth
        sx={{ bgcolor: "primary", ":focus": { bgcolor: "white" } }}
      />
    </div>
  );
};
