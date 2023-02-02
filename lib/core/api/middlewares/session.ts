import { NextApiRequest, NextApiResponse } from "next";
import signature from "cookie-signature";
import nextSession from "next-session";
import { promisifyStore } from "next-session/lib/compat";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "@api/prisma";

const secret = process.env.COOKIE_SECRET || "";

const getSession = nextSession({
  name: "connect.sid",
  decode: (raw) => signature.unsign(raw.slice(2), secret) || "",
  encode: (sid) => (sid ? "s:" + signature.sign(sid, secret) : null) || "",
  store: promisifyStore(
    new PrismaSessionStore(prisma, {
      checkPeriod: 10 * 60 * 1000, // 10 minutes
    })
  ),
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
    httpOnly: true,
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
    secure:
      process.env.NODE_ENV !== "development" && !process.env.INSECURE_AUTH,
  },
});

export const sessionMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  await getSession(req, res);
  next();
};
