import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { BsCalendar4Range } from "react-icons/bs";
import dayjs from "dayjs";
import { RANGE_DATE_PICKER_DATA } from "@/constants";
import { Button, Dialog, useTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Props } from "./types";
export const RangeDatePicker = ({ dateValue, setDateValue }: Props) => {
  const theme = useTheme();
  const today = dayjs();
  const currentYear = today.year();
  const currentMonth = today.format("MMM");
  const previousMonth = today.subtract(1, "month").format("MMM");
  const currentMonthIndex = today.month();
  const previousMonthIndex = today.month() - 1 < 0 ? 11 : today.month() - 1;

  const [range, setRange] = useState<string | dayjs.Dayjs>(
    dateValue && dateValue.startDate && dateValue.endDate
      ? `${dayjs(new Date(dateValue.startDate)).format(
          "MMM D, YYYY"
        )} - ${dayjs(new Date(dateValue.endDate)).format("MMM D, YYYY")}`
      : `${dayjs()
          .month(currentMonthIndex)
          .startOf("month")
          .format("MMM D, YYYY")} - ${today.format("MMM D, YYYY")}`
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value: string) => {
    switch (value) {
      case "Last 7 days":
        setRange(
          `${today.subtract(7, "day").format("MMM D, YYYY")} - ${today.format(
            "MMM D, YYYY"
          )}`
        );
        break;
      case "Last 28 days":
        setRange(
          `${today.subtract(28, "day").format("MMM D, YYYY")} - ${today.format(
            "MMM D, YYYY"
          )}`
        );
        break;
      case "Last 90 days":
        setRange(
          `${today.subtract(90, "day").format("MMM D, YYYY")} - ${today.format(
            "MMM D, YYYY"
          )}`
        );
        break;
      case "Last 360 days":
        setRange(
          `${today.subtract(360, "day").format("MMM D, YYYY")} - ${today.format(
            "MMM D, YYYY"
          )}`
        );
        break;
      case `${currentYear}`:
        setRange(
          `${dayjs(`${currentYear}-01-01`).format(
            "MMM D, YYYY"
          )} - ${today.format("MMM D, YYYY")}`
        );
        break;
      case `${currentYear - 1}`:
        setRange(
          `${dayjs(`${currentYear - 1}-01-01`).format("MMM D, YYYY")} - ${dayjs(
            `${currentYear - 1}-12-31`
          ).format("MMM D, YYYY")}`
        );
        break;
      case currentMonth:
        setRange(
          `${dayjs()
            .month(currentMonthIndex)
            .startOf("month")
            .format("MMM D, YYYY")} - ${today.format("MMM D, YYYY")}`
        );
        break;
      case previousMonth:
        setRange(
          `${dayjs()
            .month(previousMonthIndex)
            .startOf("month")
            .format("MMM D, YYYY")} - ${dayjs()
            .month(previousMonthIndex)
            .endOf("month")
            .format("MMM D, YYYY")}`
        );
        break;
      case "Custom":
        handleOpen();
        break;
      default:
        console.warn("Invalid option");
    }

    handleClose();
  };

  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null);

  const isBothDatesSelected =
    selectedStartDate !== null && selectedEndDate !== null;
  useEffect(() => {
    if (isBothDatesSelected) {
      setRange(
        `${selectedStartDate?.format(
          "MMM D, YYYY"
        )} - ${selectedEndDate?.format("MMM D, YYYY")}`
      );
      handleCloseCalendar();
    }
  }, [selectedStartDate, selectedEndDate, isBothDatesSelected]);
  const handleOpen = () => setOpenCalendar(true);
  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    setDateValue({
      startDate: range ? formatDate((range as string).split(" - ")[0]) : "",
      endDate: range ? formatDate((range as string).split(" - ")[1]) : "",
    });
  }, [range, setDateValue]);

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          padding: {
            xs: "4px 24px",
            sm: "10px 24px",
            md: "11px 24px",
          },
          backgroundColor: "white",
          color: theme.palette.primary.main,
          fontSize: {
            xs: "10px",
            sm: "14px",
          },
          fontWeight: "500",
          lineHeight: "16px",
          whiteSpace: "nowrap",
          textTransform: "capitalize",
        }}
        startIcon={<BsCalendar4Range />}
      >
        {range as string}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "100%",
                sm: "252px",
              },
            },
          },
        }}
      >
        {RANGE_DATE_PICKER_DATA.map((option, index) => {
          const items = [
            <MenuItem
              sx={{ width: "100%", color: theme.palette.primary.main }}
              key={index}
              onClick={() => handleMenuItemClick(option)}
            >
              {option}
            </MenuItem>,
          ];

          if (index === 3 || index === 5 || index === 7) {
            items.push(
              <Divider
                key={`divider-${index}`}
                sx={{ borderColor: theme.palette.primary.main, my: 0 }}
              />
            );
          }

          return items;
        })}
      </Menu>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={openCalendar}
          onClose={handleCloseCalendar}
          maxWidth="sm"
          fullWidth
        >
          <div className="flex gap-2 p-4 items-center justify-between">
            <DatePicker
              label="Start Date"
              value={selectedStartDate}
              onChange={(newValue) => setSelectedStartDate(newValue)}
            />

            <DatePicker
              label="End Date"
              value={selectedEndDate}
              onChange={(newValue) => setSelectedEndDate(newValue)}
            />
          </div>
        </Dialog>
      </LocalizationProvider>
    </div>
  );
};
