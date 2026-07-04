import "dotenv/config";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
async function main() {
  const passwordHash = await bcrypt.hash("admin@123", 10);
  const adminUser = await prisma.user.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {
      firstName: "Admin",
      lastName: "Admin",
      passwordHash,
    },
    create: {
      firstName: "Admin",
      lastName: "Admin",
      email: "admin@gmail.com",
      passwordHash,
    },
  });
  console.log(
    `Created/updated user: ${adminUser.firstName} ${adminUser.lastName}`,
  );
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
