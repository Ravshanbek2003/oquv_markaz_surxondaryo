import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Permission } from "@/constants";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const PermissionTable = ({ onChange, values, branches }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.ceo.admins.permissions",
  });
  const handlePermissionChange = ({
    branch,
    name,
  }: {
    branch: string;
    name: string;
  }) => {
    if (values.some((item) => item.branch === branch && item.name === name)) {
      onChange(
        values.filter((item) => !(item.branch === branch && item.name === name))
      );
    } else {
      onChange([...values, { branch, name }]);
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
    >
      <Table
        sx={{
          minWidth: {
            xs: 400,
            sm: 600,
            md: 650,
          },
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                borderRight: 1,
                borderColor: "white",
              }}
            >
              {t("title")}
            </TableCell>
            {branches?.map((branch) => (
              <TableCell
                align="center"
                key={branch._id}
                sx={{
                  color: "white",
                  borderColor: "white",
                  maxWidth: "150px",
                }}
              >
                {branch.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(Permission).map((permission) => (
            <TableRow
              key={permission}
              sx={{
                "&:last-child td, &:last-child th": { borderBottom: 0 },
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{
                  borderRight: 1,
                  borderColor: "#ccc",
                }}
              >
                {t(permission)}
              </TableCell>
              {branches?.map((branch) => (
                <TableCell
                  align="center"
                  key={`${permission}-${branch._id}`}
                  sx={{ borderColor: "#ccc" }}
                >
                  <Checkbox
                    defaultChecked={
                      !!values.find(
                        (item) =>
                          item.branch === branch._id && item.name === permission
                      )?.branch
                    }
                    onChange={() =>
                      handlePermissionChange({
                        branch: branch._id,
                        name: permission,
                      })
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
