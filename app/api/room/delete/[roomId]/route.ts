import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: {params: Promise<{ roomId: string }>} ) {
    const { roomId } = await params;
    try {
        const deletedRoom = await prisma.room.delete({
            where: {
                id: roomId,
            },
        });
        return NextResponse.json({ message: "Data Room Deleted Succesfuly", data: deletedRoom }, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}


export async function PUT(request: NextRequest, { params }: {params: Promise<{ roomId: string }>} ) {
    const { roomId } = await params;

    const { nama, deskripsi, kapasitas, lokasi, gambar } = await request.json();

    
    try {

        const updateRoom = await prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                nama,
                deskripsi,
                kapasitas,
                lokasi,
                gambar,
            },
        });

        return NextResponse.json({ message: "Data Room Updated Succesfuly", data: updateRoom }, { status: 200 });   


    } catch(err: unknown){
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}