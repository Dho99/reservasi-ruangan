import { prisma } from "@/lib/prisma" 


export const findUserByEmail = async (email: string) => {
  return await prisma?.user?.findUnique({
    where: { email }
  });
}