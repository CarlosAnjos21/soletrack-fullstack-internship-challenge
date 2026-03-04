import { prisma } from "./database/prisma";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("admin135", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Carlos",
      email: "adminCarlos@email.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Novo ADMIN criado:", admin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());