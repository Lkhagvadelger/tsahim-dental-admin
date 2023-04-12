import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@prisma/client";
import { AppError } from "@util/errors";

export type AppRequest = Express.Request &
  NextApiRequest & {
    session: { userId?: string };
    user: User;
  };

export type AppResponse = NextApiResponse & {
  sendSuccess: (data?: Record<string, any> | null) => void;
  sendError: (
    error: AppError | number | unknown,
    message?: string,
    translationKey?: string,
    isOperational?: boolean
  ) => void;
};
