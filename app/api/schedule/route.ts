import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest, { params }: { params: Promise<{ roomId: string, startDate: string }> }) {
    try {
        const { roomId, startDate } = await params;

        const schedules = await prisma.reservation.findMany({   
            where: {
                roomId: roomId,
                createdAt: new Date(startDate).toDateString(),
            },
            include: {
                room: true,
                user: true,
            }
        });

        return NextResponse.json({ data: schedules }, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}