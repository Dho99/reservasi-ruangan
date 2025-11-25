export const blockedSlotService = {
    getBlockedSlots: (roomId: string, date: string) => ({url: `/api/blocked-slots?roomId=${roomId}&date=${date}`, method: 'GET'})
}