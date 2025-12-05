/**
 * Konstanta untuk jam operasional ruangan
 * Semua ruangan memiliki jam operasional yang sama
 */
export const ROOM_OPERATING_HOURS = {
  OPEN: "07:00",
  CLOSE: "17:00",
} as const;

/**
 * Helper function untuk validasi waktu dalam jam operasional
 */
export function isWithinOperatingHours(time: string): boolean {
  return time >= ROOM_OPERATING_HOURS.OPEN && time <= ROOM_OPERATING_HOURS.CLOSE;
}

/**
 * Helper function untuk format jam operasional
 */
export function getOperatingHoursText(): string {
  return `${ROOM_OPERATING_HOURS.OPEN} - ${ROOM_OPERATING_HOURS.CLOSE}`;
}

