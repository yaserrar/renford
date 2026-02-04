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

export const compareDates = (date1: Date | string, date2: Date | string) => {
  return (
    moment(date1).format("DD-MM-YYYY") >= moment(date2).format("DD-MM-YYYY")
  );
};
