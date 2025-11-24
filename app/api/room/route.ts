import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        const rooms = await prisma.room.findMany();
        return NextResponse.json({data: rooms}, {status: 200});
    } catch(err: unknown) {
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
    const { nama, deskripsi, kapasitas, lokasi, gambar} = await request.json();
    const newRooom = prisma.room.create({
        data: {
            nama,
            deskripsi,
            kapasitas,
            lokasi,
            gambar
        }
    });

    return NextResponse.json({data: newRooom}, {status: 201});
    }catch(err: unknown) {
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}