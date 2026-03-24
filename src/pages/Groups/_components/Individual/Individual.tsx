import {
  Badge,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { MdOutlineEdit } from "react-icons/md";

export const Individual = () => {
  const { t } = useTranslation();
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">#</TableCell>
            <TableCell align="left">{t("full_names")}</TableCell>
            <TableCell align="center">{t("phone_number")}</TableCell>
            <TableCell align="center">{t("individual_discount")}</TableCell>
            <TableCell align="center">{t("comment")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center">1</TableCell>
            <TableCell align="left">Xo’janazarov Asilbek</TableCell>
            <TableCell align="center">+998940302984</TableCell>
            <TableCell align="center">
              <div className="flex gap-2 justify-center">
                <Chip
                  size="medium"
                  label="100.00"
                  sx={{
                    fontSize: "12px",
                    height: "24px",
                    borderRadius: "4px",
                  }}
                />
                <Badge
                  badgeContent={
                    <Box
                      sx={{
                        borderWidth: "2px ",
                        borderStyle: "solid",
                        borderRadius: "50%",
                        borderColor: "primary.dark",
                        padding: "1px",
                        bgcolor: "#fff",
                      }}
                    >
                      <MdOutlineEdit size={14} />
                    </Box>
                  }
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <Chip
                    size="medium"
                    label="+50%"
                    sx={{
                      fontSize: "12px",
                      height: "24px",
                      borderRadius: "4px",
                      bgcolor: "primary.main",
                      color: "#fff",
                    }}
                  />
                </Badge>
              </div>
            </TableCell>
            <TableCell align="center">+998940302984</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
