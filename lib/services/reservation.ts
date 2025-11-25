export const reservationService = {
    createReservation: () => ({url: '/api/reservation', method: 'POST'}),
    getReservations: (roomId: string, startDate: string) => ({url: `/api/schedule?roomId=${roomId}&startDate=${startDate}`, method: 'GET'}),
    cancelReservation: (reservationId: string) => ({url: `/api/reservation/delete/${reservationId}`, method: 'DELETE'}),
    updateReservation: (reservationId: string) => ({url: `/api/reservation/update/${reservationId}`, method: 'PUT'}),
};