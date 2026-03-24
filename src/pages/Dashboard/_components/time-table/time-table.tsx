import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { Props } from "./types";
import { WeekDay } from "./types";
import { GroupsList } from "./components";
import { Loader } from "@/components";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export const TimeTable = ({ isLoading, groups = [], rooms = [] }: Props) => {
  const { t } = useTranslation("", { keyPrefix: "dashboard" });
  const theme = useTheme();
  const weekDays = useMemo(() => {
    const today = new Date();
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const result = [];

    for (let i = 1; i <= 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i - today.getDay());
      const date = {
        label: `${t(days[currentDate.getDay()])} ${currentDate.getDate()}`,
        date: currentDate,
        isToday: currentDate.getDate() === new Date().getDate(),
      };
      result.push(date);
    }

    return result;
  }, [t]);

  const getDayGroups = useCallback(
    (date: Date, roomID: string) => {
      const result = groups.filter(
        (group) =>
          group?.days?.includes(date.getDay() as WeekDay) &&
          group?.room?._id === roomID
      );
      return result;
    },
    [groups]
  );

  const [isScrolled, setIsScrolled] = useState(false);
  const tableContainerRef = useRef<HTMLTableElement>(null);
  const handleScroll = () => {
    if (tableContainerRef.current) {
      const scrollLeft = tableContainerRef.current.scrollLeft;
      setIsScrolled(scrollLeft > 0);
    }
  };

  if (isLoading) {
    return <Loader sx={{ height: "55vh", backgroundColor: "transparent" }} />;
  }

  return (
    <div className="shadow-box bg-white rounded-2xl overflow-hidden pb-2">
      <div
        className="overflow-auto w-full"
        onScroll={handleScroll}
        ref={tableContainerRef}
      >
        <table className="lg:w-full w-max">
          <thead>
            <tr>
              <th
                className={
                  thClassName +
                  ` sticky top-0 left-0 ${
                    isScrolled
                      ? "shadow-[inset_-2px_0px_#EDF2F7]"
                      : "shadow-none"
                  }`
                }
              >
                {t("rooms_days")}
              </th>
              {weekDays.map((date) => (
                <Fragment key={date.label}>
                  {date.isToday ? (
                    <th
                      key={date.label}
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        textTransform: "capitalize",
                        minWidth: "150px",
                      }}
                    >
                      {date.label}
                    </th>
                  ) : (
                    <th
                      style={{ textTransform: "capitalize", minWidth: "150px" }}
                      key={date.label}
                      className={thClassName}
                    >
                      {date.label}
                    </th>
                  )}
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms?.length ? (
              rooms.map((room) => (
                <tr key={room?._id} className="group">
                  <td
                    className={`px-10 py-5 text-black font-semibold text-center group-even:bg-[#f4f4f5] w-40 min-w-max sticky top-0 left-0 bg-white ${
                      isScrolled
                        ? "shadow-[inset_-2px_0px_#EDF2F7]"
                        : "shadow-none"
                    }`}
                  >
                    {room.title}
                  </td>
                  {weekDays.map((date) => (
                    <td key={date.label} className="py-5 px-9 border">
                      <div className="flex flex-col gap-2.5">
                        <GroupsList
                          groups={getDayGroups(date.date, room?._id)}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className={"text-center text-black font-medium h-80"}
                >
                  Not available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thClassName =
  "bg-[#FAFAFB] text-[#16192C] py-3 px-10 border border-[#EDF2F7]";
