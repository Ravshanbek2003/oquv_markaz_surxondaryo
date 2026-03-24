import dayjs from "dayjs";
const today = dayjs();
const currentYear = today.year();
const currentMonth = today.format("MMM");
const previousMonth = today.subtract(1, "month").format("MMM");

export const RANGE_DATE_PICKER_DATA = [
  "Last 7 days",
  "Last 28 days",
  "Last 90 days",
  "Last 360 days",
  `${currentYear}`,
  `${currentYear - 1}`,
  currentMonth,
  previousMonth,
  "Custom",
];
