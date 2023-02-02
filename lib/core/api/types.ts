import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@prisma/client";
import { defineRulesFor } from "@lib/auth/api/abilities";
import { AppError } from "@util/errors";

export type AppRequest = Express.Request &
  NextApiRequest & {
    session: { userId?: string };
    user: User;
    ability: ReturnType<typeof defineRulesFor>;
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
