import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const blockedRooms = await prisma.blockedSlot.findMany({
      include: {
        room: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        data: blockedRooms,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error fetching blocked slots:", err);
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
    const { roomId, waktuMulai, waktuSelesai, alasan } = await request.json();

    const newBlockedRoom = await prisma.blockedSlot.create({
      data: {
        roomId,
        waktuMulai: new Date(waktuMulai),
        waktuSelesai: new Date(waktuSelesai),
        alasan,
      },
    });

    return NextResponse.json(
      {
        data: newBlockedRoom,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Error creating blocked slot:", err);
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { roomId } = await request.json();
    const deleteBlockedRoom = await prisma.blockedSlot.delete({
      where: {
        id: roomId
      }
    });

    return NextResponse.json({
      message: "Blocked room entry deleted successfully",
      data: deleteBlockedRoom
    }, {status: 200})
  } catch (err: unknown) {
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
