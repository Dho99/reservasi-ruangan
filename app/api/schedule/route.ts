import {NextRequest, NextResponse} from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const schedules = await prisma.room.findMany();

        return NextResponse.json({
            data: schedules,
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching schedules:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }


}