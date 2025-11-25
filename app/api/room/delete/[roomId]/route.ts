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