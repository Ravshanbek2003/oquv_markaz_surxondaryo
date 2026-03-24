import { useTheme } from "@mui/material/styles";
import {
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import {
  useGetAllGroupsQuery,
  useLazyGetPaymentExpectedQuery,
} from "@/app/api";
import { useSelector } from "react-redux";
import { Loader } from "@/components";
import { formatAmount, formatUzbekPhoneNumber } from "@/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
export const Expected = () => {
  const { t } = useTranslation("", { keyPrefix: "budget.expected" });
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const { data: { groups } = {}, isLoading: isGettingGroups } =
    useGetAllGroupsQuery({ branch });
  const [selectedGroup, setSelectedGroup] = useState("");
  const [
    getExpectedData,
    {
      data: { data: expected = {} } = {},
      isLoading: isGettingPayments,
      isFetching,
    },
  ] = useLazyGetPaymentExpectedQuery();

  const [totalExpected, setTotalExpected] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (branch && getExpectedData) {
      getExpectedData({
        branch,
        group: selectedGroup,
      });
    }
  }, [branch, selectedGroup]);

  useEffect(() => {
    if (Object.values(expected).length > 0) {
      const total = Object.values(expected).reduce(
        (acc, item) =>
          acc +
          (item?.expected - item?.paid > 0 ? item?.expected - item?.paid : 0),
        0
      );
      setTotalExpected(total);
    }
  }, [expected]);

  if (isGettingGroups || isGettingPayments || isFetching) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
  }

  return (
    <div>
      <Stack
        direction="row"
        sx={{
          gap: {
            xs: "8px",
            sm: "20px",
          },
        }}
        alignItems="center"
      >
        <Select
          IconComponent={IoIosArrowDown}
          sx={{
            border: "none",
            outline: "none",
            paddingRight: {
              xs: "6px",
              sm: "13px",
            },
            ".MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:focus": { outline: "none" },
            fontSize: {
              xs: "18px",
              sm: "26px",
              md: "34px",
            },
            fontWeight: "bold",
            color: theme.palette.primary.main,
            width: "fit-content",
            ".MuiSelect-icon": {
              color: theme.palette.primary.main,
              transition: "transform 0.2s ease-in-out",
              right: "0px",
            },
          }}
          displayEmpty
          renderValue={(value) => {
            if (value) {
              return groups?.find((group) => group._id === value)?.name;
            }
            return t("all_groups");
          }}
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <MenuItem value="">{t("all_groups")}</MenuItem>
          {groups?.map((group) => (
            <MenuItem value={group._id} key={group._id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
        <Typography
          variant="h1"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 900,
            fontSize: {
              xs: "16px",
              sm: "24px",
              md: "30px",
            },
          }}
        >
          {t("total")}: {formatAmount(totalExpected)} {t("uzs")}
        </Typography>
      </Stack>
      <TableContainer
        color="primary"
        sx={{ borderRadius: "8px", border: "1px solid #ccc" }}
      >
        <Table
          sx={{ minWidth: 650, bgcolor: "#fff" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                #
              </TableCell>
              <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                {t("full_name")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("phone_number")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("paid")}
              </TableCell>
              <TableCell
                sx={{ color: "primary.main", fontWeight: "bold" }}
                align="justify"
              >
                {t("expected")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expected && Object.values(expected).length ? (
              Object.values(expected)?.map((item, index) => (
                <TableRow
                  key={item?.student?._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {item?.student?.fullName || "No data"}
                  </TableCell>
                  <TableCell align="justify" sx={{ minWidth: "180px" }}>
                    {formatUzbekPhoneNumber(
                      item?.student.phoneNumber as string
                    )}
                  </TableCell>
                  <TableCell align="justify" sx={{ minWidth: "100px" }}>
                    {formatAmount(item?.paid)}
                  </TableCell>
                  <TableCell align="justify" sx={{ minWidth: "100px" }}>
                    {formatAmount(
                      item?.expected - item?.paid > 0
                        ? item?.expected - item?.paid
                        : 0
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t("no_data")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
