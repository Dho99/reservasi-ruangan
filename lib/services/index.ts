import { authService } from "./auth";
import { reservationService } from "./reservation";

export const services = {
    reservation: reservationService,
    auth: authService,
};