import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcrypt-ts';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password." },
                { status: 401 }
            );
        }

        if(user?.role !== "ADMIN"){
            return NextResponse.json(
                { message: "Access denied. Admins only." },
                { status: 403 }
            );
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid email or password." },
                { status: 401 }
            );
        }

        return NextResponse.json({ data: user }, { status: 200 });
        
    } catch (err: unknown) {
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}