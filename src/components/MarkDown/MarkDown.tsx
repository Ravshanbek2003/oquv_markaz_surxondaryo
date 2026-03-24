import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box, Typography } from "@mui/material";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <>
      <Box
        sx={{
          border: error ? "2px solid red" : "1px solid #ccc",
          height: "200px",
          borderRadius: "4px",
          padding: "4px",
          marginBottom: error ? "8px" : "16px",
        }}
      >
        <ReactQuill
          theme="snow"
          className="h-[148px]"
          placeholder=""
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ align: ["right", "center", "justify"] }],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          }}
          formats={[
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "link",
            "color",
            "image",
            "background",
            "align",
          ]}
          value={value}
          onChange={onChange}
        />
      </Box>
      {error && (
        <Typography
          sx={{
            marginTop: "-20px",
            marginLeft: "12px",
          }}
          color="error"
          variant="caption"
        >
          {error}
        </Typography>
      )}
    </>
  );
};
