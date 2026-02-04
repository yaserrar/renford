import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

export const tokenExp = (token: string | undefined) => {
  if (!token) return true;
  const jwt = jwtDecode(token);
  const isExpired =
    jwt && jwt.exp
      ? dayjs.unix(jwt.exp).diff(dayjs()) < 10 * 1000 // 10 seconds
      : true;
  return isExpired;
};
