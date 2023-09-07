import { getCookies } from "cookies-next";
import { type IncomingMessage, type ServerResponse } from "http";
import { prisma } from "~/server/db";
import { getSession } from "~/server/utils/getSession";

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
