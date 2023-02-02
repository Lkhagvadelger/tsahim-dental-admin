import {
  PrismaClient,
} from "@prisma/client";
import CSVToJSON from "csvtojson";
import * as bcrypt from "bcryptjs"; 

const prisma = new PrismaClient();

async function generatePasswordDigest() {
  return bcrypt.hash("changeme", 10);
}


async function main() {
  const userEmails = [];
  for (let i = 1; i <= 10; i++) {
    await prisma.user.upsert({
      where: { email:'user'+i+'@b.b' },
      update: {},
      create: {
        email:'user'+i+'@b.b',
        passwordDigest: await generatePasswordDigest(),
        role: "USER",
        phoneNumber: (88889000 + i++).toString(),
        phoneNumberVerified: new Date()
      },
    });
    await prisma.user.upsert({
      where: { email:'admin'+i+'@b.b' },
      update: {},
      create: {
        email:'admin'+i+'@b.b',
        passwordDigest: await generatePasswordDigest(),
        role: "ADMIN",
        phoneNumber: (88888000 + i++).toString(),
        phoneNumberVerified: new Date()
      },
    });
  }
   
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
