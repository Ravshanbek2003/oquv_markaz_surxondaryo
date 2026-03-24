import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export const SMSLogs = () => (
  <div>
    <TableContainer
      color="primary"
      sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
    >
      <Table sx={{ minWidth: 650, bgcolor: "#fff" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{ width: "20px", fontWeight: "bold", color: "primary.main" }}
            >
              #
            </TableCell>
            <TableCell
              sx={{ color: "primary.main", fontWeight: "bold" }}
              align="left"
            >
              Templates
            </TableCell>
            <TableCell
              sx={{ color: "primary.main", fontWeight: "bold" }}
              align="left"
            >
              SMS
            </TableCell>
            <TableCell
              sx={{ color: "primary.main", fontWeight: "bold" }}
              align="left"
            >
              Receiver
            </TableCell>
            <TableCell
              sx={{ color: "primary.main", fontWeight: "bold" }}
              align="left"
            >
              Sender
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell
              component="th"
              scope="row"
              align="center"
              sx={{ width: "20px" }}
            >
              1
            </TableCell>
            <TableCell align="left">09.13.2023 | 06:08</TableCell>
            <TableCell align="left">Siz qarzdorlar ro'yhatidasiz</TableCell>
            <TableCell align="left">
              <Typography variant="body2" sx={{ fontWeight: "600" }}>
                Baxodir
              </Typography>
              <a
                href="tel:+998997724558"
                className="font-sans font-medium text-right text-[14px] leading-[16px] hover:underline text-primary-100"
              >
                99 772-45-58
              </a>
            </TableCell>
            <TableCell align="left">John Doe</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
