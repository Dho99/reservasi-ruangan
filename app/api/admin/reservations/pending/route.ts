import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        const pendingReservations = await prisma.reservation.findMany({
            where: {
                status: "MENUNGGU"
            },
            include: {
                room: true,
                user: {
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
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

        // Update reservasi yang dipilih
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

        // Jika status DISETUJUI, auto-reject reservasi lain di ruangan dan waktu yang sama
        if (status === "DISETUJUI") {
            // Ambil data reservasi yang baru disetujui
            const approvedReservation = await prisma.reservation.findUnique({
                where: { id: reservationId },
                select: {
                    roomId: true,
                    waktuMulai: true,
                    waktuSelesai: true,
                }
            });

            if (approvedReservation) {
                // Cari reservasi lain yang bentrok (MENUNGGU) di ruangan dan waktu yang sama
                const conflictingReservations = await prisma.reservation.findMany({
                    where: {
                        id: { not: reservationId }, // Exclude yang baru disetujui
                        roomId: approvedReservation.roomId,
                        status: "MENUNGGU",
                        OR: [
                            // Waktu mulai berada di antara reservasi yang disetujui
                            {
                                waktuMulai: {
                                    gte: approvedReservation.waktuMulai,
                                    lt: approvedReservation.waktuSelesai,
                                }
                            },
                            // Waktu selesai berada di antara reservasi yang disetujui
                            {
                                waktuSelesai: {
                                    gt: approvedReservation.waktuMulai,
                                    lte: approvedReservation.waktuSelesai,
                                }
                            },
                            // Reservasi yang mengcover seluruh waktu yang disetujui
                            {
                                AND: [
                                    { waktuMulai: { lte: approvedReservation.waktuMulai } },
                                    { waktuSelesai: { gte: approvedReservation.waktuSelesai } }
                                ]
                            }
                        ]
                    }
                });

                // Auto-reject semua reservasi yang bentrok
                if (conflictingReservations.length > 0) {
                    await prisma.reservation.updateMany({
                        where: {
                            id: {
                                in: conflictingReservations.map(r => r.id)
                            }
                        },
                        data: {
                            status: "DITOLAK",
                            alasanPenolakan: "Ruangan sudah disetujui untuk penggunaan lain pada waktu yang sama"
                        }
                    });
                }
            }
        }

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