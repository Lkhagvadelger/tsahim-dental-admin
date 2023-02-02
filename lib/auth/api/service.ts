import { getUserById } from "@lib/user/api/userService";
import { prisma } from "@api/prisma";

export const serializeUser = (user: any, callback: any) => {
  callback(null, user.id);
};

export const deserializeUser = async (id: string, callback: any) => {
  const user = await getUserById(id);
  callback(null, user);
};

export const deleteUser = async (userId: string,phoneNumber:string, email:string) => {
  await prisma.user.update({
    where: {id:userId},
    data:{
      phoneNumber:phoneNumber+userId,
      email:email+userId,
      passwordDigest: "deleted"
    }
  })
  
};
export * from "./strategies/facebook";
export * from "./strategies/google";
export * from "./strategies/local";
export * from "./strategies/bearer";
 