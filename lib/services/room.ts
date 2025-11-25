export const roomService = {
    getRooms: () => ({url: '/api/room', method: 'GET'}),
    getRoomById: (roomId: string) => ({url: `/api/room/${roomId}`, method: 'GET'}),
    createRoom: () => ({url: '/api/room', method: 'POST'}),
    updateRoom: (roomId: string) => ({url: `/api/room/${roomId}`, method: 'PUT'}),
    deleteRoom: (roomId: string) => ({url: `/api/room/delete/${roomId}`, method: 'DELETE'}),
};