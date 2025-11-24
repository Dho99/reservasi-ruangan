import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt-ts"

export async function POST(request: NextRequest) {
    try {
        const { nama, email, password, role } = await request.json();

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists." },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                nama,
                email,
                password: hashedPassword,
                role
            }
        });

        return NextResponse.json({ data: newUser }, { status: 201 });

    }catch(err: unknown){
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
