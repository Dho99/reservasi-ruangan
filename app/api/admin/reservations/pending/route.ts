import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        const pendingReservations = await prisma.reservation.findMany({
            where: {
                status: "MENUNGGU"
            }
        });

        return NextResponse.json({ data: pendingReservations }, { status: 200 });
    }catch(err: unknown){
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest){
    try {
         const {
            userId,
            reservationId,
            roomId,
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
                status,
                alasanPenolakan
            }
        });

        return NextResponse.json({
            message: "Reservation Data updated Successfully",
            data: editReservation
        }, {status: 200});



    }catch(err: unknown){
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}