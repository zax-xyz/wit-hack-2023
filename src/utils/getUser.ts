import { getCookies } from "cookies-next";
import { type IncomingMessage, type ServerResponse } from "http";

export const getIsAuthenticated = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const cookies = getCookies({ req, res });
  return (
    cookies.authenticated !== undefined &&
    JSON.parse(cookies.authenticated) === true
  );
};
