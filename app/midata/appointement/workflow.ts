import {Appointment} from "./appointement";
import {Session} from "../../hooks/login";
import {authFetch} from "../client";

export class AppointmentWorkflow {
    constructor(readonly session: Session,
                readonly appointment: Appointment,
                readonly changed: boolean = false) {
    }
}