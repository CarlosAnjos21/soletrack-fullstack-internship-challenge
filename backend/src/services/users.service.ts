import { prisma } from "../database/prisma";

export const listUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
    },
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const updateUserRole = async (id: string, role: "ADMIN" | "OPERATOR") => {
  return prisma.user.update({
    where: { id },
    data: { role },
  });
};