import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        room: true,
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: reservations }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching reservations:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      roomId,
      waktuMulai,
      waktuSelesai,
      keperluan,
      jumlahPeserta,
      alasanPenolakan,
    } = await request.json();

    // Check for existing reservations
    const checkExistingReservation = await prisma.reservation.findFirst({
      where: {
        roomId,
        waktuMulai: {
          lt: waktuSelesai,
        },
        waktuSelesai: {
          gt: waktuMulai,
        },
        status: "DISETUJUI" ,
      },
    });

    if (checkExistingReservation) {
      return NextResponse.json(
        { message: "Room is already booked for the selected time slot." },
        { status: 409 }
      );
    }

    // Check for blocked slots
    const checkBlockedSlot = await prisma.blockedSlot.findFirst({
      where: {
        roomId,
        waktuMulai: {
          lt: waktuSelesai,
        },
        waktuSelesai: {
          gt: waktuMulai,
        },
      },
    });

    if (checkBlockedSlot) {
      return NextResponse.json(
        {
          message:
            "Ruangan sedang diblokir untuk waktu tersebut. Silakan pilih waktu lain.",
        },
        { status: 409 }
      );
    }

    const newReservation = await prisma.reservation.create({
      data: {
        userId,
        roomId,
        waktuMulai,
        waktuSelesai,
        keperluan,
        jumlahPeserta,
        status: "MENUNGGU",
        alasanPenolakan,
      },
    });

    return NextResponse.json({ data: newReservation }, { status: 201 });
  } catch (err: unknown) {
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
    const { reservationId } = await request.json();

    const deleteReservation = await prisma.reservation.delete({
      where: {
        id: reservationId,
      },
    });

    return NextResponse.json(
      {
        message: "Reservation Data deleted Successfully",
        data: deleteReservation,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      userId,
      reservationId,
      roomId,
      waktuMulai,
      waktuSelesai,
      keperluan,
      jumlahPeserta,
      status,
      alasanPenolakan,
    } = await request.json();

    const editReservation = await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        userId,
        roomId,
        waktuMulai,
        waktuSelesai,
        keperluan,
        jumlahPeserta,
        status,
        alasanPenolakan,
      },
    });

    return NextResponse.json(
      {
        message: "Reservation Data updated Successfully",
        data: editReservation,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
