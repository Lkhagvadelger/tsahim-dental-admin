import { prisma } from "@api/prisma";
import { Ability, subject } from "@casl/ability";
import { AppError, ERROR_MESSAGES } from "@util/errors";
import { Profile } from "@prisma/client";
import { changeEmail } from "@lib/user/api/userService";

interface GetProfileInput {
  ability: Ability;
  userId: string;
}

export const getProfile = async ({ ability, userId }: GetProfileInput) => {
  if (!ability.can("read", subject("Profile", { userId }))) {
    throw new AppError(401, ERROR_MESSAGES.UNAUTHORIZED, "unauthorized");
  }

  return prisma.profile.findUnique({ where: { userId } });
};

interface UpdateProfileInput {
  ability: Ability;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  emailAddress: string;
}

export const updateProfile = async ({
  ability,
  userId,
  firstName,
  lastName,
  birthDate,
  emailAddress,
}: UpdateProfileInput) => {
  if (!ability.can("update", subject("Profile", { userId }))) {
    throw new AppError(401, ERROR_MESSAGES.UNAUTHORIZED, "unauthorized");
  }
  await changeEmail({ userId, email: emailAddress });

  return prisma.profile.upsert({
    where: { userId },
    update: {
      firstName,
      lastName,
      birthDate: new Date(birthDate),
    },
    create: {
      userId,
      firstName,
      lastName,
      birthDate: new Date(birthDate),
    },
  });
};

interface ToggleNotifyInput {
  ability: Ability;
  userId: string;
  toggleName: string;
}
