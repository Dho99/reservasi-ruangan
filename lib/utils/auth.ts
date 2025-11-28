import { prisma } from "@/lib/prisma" 


export const findUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if(!user) return null;

    return user;
  } catch (error) {
    console.log("Error finding user by email:", error);
    return null;
  }
}