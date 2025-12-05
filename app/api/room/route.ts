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
        
        // Validate required fields
        if (!nama || !kapasitas || !lokasi) {
            return NextResponse.json(
                { message: "Nama, kapasitas, dan lokasi wajib diisi" },
                { status: 400 }
            );
        }

        const newRoom = await prisma.room.create({
            data: {
                nama,
                deskripsi: deskripsi || null,
                kapasitas: parseInt(kapasitas),
                lokasi,
                gambar: gambar || null
            }
        });

        return NextResponse.json({
            message: "Ruangan berhasil ditambahkan",
            data: newRoom
        }, {status: 201});
    } catch(err: unknown) {
        console.error("Error creating room:", err);
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
