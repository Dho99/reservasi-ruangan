import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt-ts"

export async function POST(request: NextRequest) {
    try {
        const { nama, email, password, role } = await request.json();

        let userRole = role;

        if(!email.includes('unsil.ac.id')){
            return NextResponse.json(
                { message: "Email harus berakhiran @unsil.ac.id" },
                { status: 400 }
            );
        }

        if(email.endsWith('@student.unsil.ac.id')){
            userRole = "MAHASISWA";
        } else {
            userRole = "ADMIN";
        }

        const existingUser = await prisma?.user?.findUnique({
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

        const newUser = await prisma?.user?.create({
            data: {
                nama,
                email,
                password: hashedPassword,
                role: userRole
            }
        });

        console.log(newUser);

        return NextResponse.json({ message: "Registrasi Berhasil" }, { status: 201 });

    }catch(err: unknown){
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
