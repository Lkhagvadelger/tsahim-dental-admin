import {
  User,
  Session
} from "@prisma/client";
import { AbilityClass, AbilityBuilder } from "@casl/ability";
import { PrismaAbility, Subjects } from "@casl/prisma";

type AppAbility = PrismaAbility<
  [
    string,
    Subjects<{
      User: User;
      Session: Session;
    }>
  ]
>;

const AppAbility = PrismaAbility as AbilityClass<AppAbility>;

export const defineRulesFor = (user?: User) => {
  const { can, build } = new AbilityBuilder(AppAbility);

  if (!user) return build();

  switch (user.role) {
    case "ADMIN":
      can("manage", "User", "all");
      can("manage", "Profile", "all");
      break;
    case "USER":
      can("manage", "User", { id: user.id });
      can("manage", "Profile", { userId: user.id });
      break;
    default:
      break;
  }

  return build();
};
