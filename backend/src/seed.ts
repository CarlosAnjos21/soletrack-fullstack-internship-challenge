import { prisma } from "./database/prisma";
import bcrypt from "bcrypt";

async function seed() {
  const adminExists = await prisma.user.findFirst({
    where: {
      email: "admin@admin.com"
    }
  });

  if (!adminExists) {
    const password = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
      data: {
        name: "Carlos Admin",
        email: "admin@admin.com",
        password,
        role: "ADMIN"
      }
    });

    console.log("✅ Admin criado");
  } else {
    console.log("⚠️ Admin já existe");
  }
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());