import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export function Sms() {
  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>SMS</TableCell>
              <TableCell align="center">Sender</TableCell>
              <TableCell align="center">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {new Array(2).fill(" ").map((row, index) => (
              <TableRow
                key={row.name}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </TableCell>
                <TableCell align="center">Hakimov Bekzod</TableCell>
                <TableCell align="center">05.31.2024 | 21:32</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
