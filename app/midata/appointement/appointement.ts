import {Status} from "./monthly";
import {AppointmentWorkflow} from "./workflow";
import {authFetch} from "../client";
import {Session} from "../../hooks/login";

export type Appointment = {
    id?: string,
    meta?: { versionId: string, lastUpdated: string },
    status: Status,
    comment?: string,
    description?: string,
    start?: string,
    end?: string,
    participant: Participant[]
}

export type ParticipantStatus
    = "accepted" | "declined" | "tentative"

export type Participant = {
    status: ParticipantStatus,
    actor: {
        reference?: string,
        display?: string,
        identifier?: { system: "http://midata.coop/identifier/patient-login-or-invitation", value: string }
    }
}

type GetAppointmentCommand = {session: Session, signal: AbortSignal|undefined, appointmentId: string}

export const getAppointment = ({session, signal, appointmentId}: GetAppointmentCommand): Promise<Appointment> =>
    authFetch<Appointment>({
        signal,
        session,
        method: "GET",
        path: `/Appointment/${appointmentId}`
    })