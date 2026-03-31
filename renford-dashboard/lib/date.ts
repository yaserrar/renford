import moment from "moment";

export const formatDatetime = (date: Date | undefined | null) => {
  if (!date) return "";
  return moment(date).format("DD-MM-YYYY HH:mm");
};

export const formatTime = (date: Date | undefined | null) => {
  if (!date) return "";
  return moment(date).format("HH:mm");
};

export const formatDate = (date: Date | undefined | null) => {
  if (!date) return "";
  return moment(date).format("DD-MM-YYYY");
};

export const formatWeekdayDayMonth = (
  date: Date | string | undefined | null,
  fallback = "-",
) => {
  if (!date) return fallback;

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return fallback;

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(parsed);
};

export const compareDates = (date1: Date | string, date2: Date | string) => {
  return (
    moment(date1).format("DD-MM-YYYY") >= moment(date2).format("DD-MM-YYYY")
  );
};
