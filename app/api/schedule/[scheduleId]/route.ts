import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: {params: Promise<{ scheduleId: string }>} ) {
    try {
        const { scheduleId } = await params;
        const schedule = await prisma.reservation.findUnique({
            where: {
                id: scheduleId,
            },
            include: {
                room: true,
                user: true,
            }
        });
        return NextResponse.json({data: schedule}, {status: 200});
    }catch(err: unknown) {
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: {params: Promise<{ scheduleId: string }>} ) {
    try {
        const { scheduleId } = await params;
        const deletedSchedule = await prisma.reservation.delete({
            where: {
                id: scheduleId,
            },
        });
        return NextResponse.json({message: "Reservation Deleted Successfully", data: deletedSchedule}, {status: 200});
    }  catch(err: unknown) {
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: {params: Promise<{ scheduleId: string }>} ) {
    try {
        const { scheduleId } = await params;
        const { waktuMulai, waktuSelesai } = await request.json();
        const updatedSchedule = await prisma.reservation.update({
            where: {
                id: scheduleId,
            },
            data: {
                waktuMulai,
                waktuSelesai,
            },
        });
        return NextResponse.json({message: "Reservation Updated Successfully", data: updatedSchedule}, {status: 200});
    } catch(err: unknown) {
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
