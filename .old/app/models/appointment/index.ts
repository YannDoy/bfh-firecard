import {
    allParticipantsNameL,
    isCancelledL,
    isSettledL,
    Participant, ParticipantStatus,
    selfParticipantStatusL,
} from "../participant";
import {compL, compose, const_, Lens, lens, modify, propL, view} from "../../utils/lenses";
import {MonthlyAppointment} from "./monthly";

export type Status
    = 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled'

export type Appointment = {
    resourceType: "Appointment",
    id?: string,
    meta?: { versionId: string, lastUpdated?: string },
    status?: Status,
    description?: string,
    start?: string,
    end?: string,
    participant?: Participant[]
}

const participantsL: Lens<Appointment, Participant[]> = propL('participant', [] as Participant[])
const allParticipantsName2L = compL(participantsL, allParticipantsNameL)
const isSettled2L = compL(participantsL, isSettledL)
const isCancelled2L = compL(participantsL, isCancelledL)
const statusL: Lens<Appointment, Status> = propL("status", "proposed" as Status)

const isCancelled = view(isCancelled2L)
const isSettled = view(isSettled2L)
const getAppointmentStatus = (ap: Appointment): Status =>
    (ap.start === undefined || ap.end === undefined) && 'proposed' ||
    (ap.end !== undefined && Date.parse(ap.end) < Date.now()) && 'fulfilled' ||
    (ap.start !== undefined && Date.parse(ap.start) <= Date.now()) && 'arrived' ||
    isCancelled(ap) && 'cancelled' ||
    isSettled(ap) && 'booked' ||
    "pending"

const invalidSettle: (ap: Appointment) => Appointment = modify(isSettled2L, false)
const fixAppointmentStatus = (ap: Appointment): Appointment => {
    const status = getAppointmentStatus(ap)
    return ap.status !== status ? {...ap, status} : ap
}

const editL = (key: 'description' | 'start' | 'end',
                      selfParticipantStatus2L: Lens<Appointment, ParticipantStatus>): Lens<Appointment, string> => {
    const fieldL: Lens<Appointment, string> = propL(key, "")
    const selfAccept = modify(selfParticipantStatus2L, "accepted")
    const fixOnEdition = compose(fixAppointmentStatus, compose(selfAccept, invalidSettle))
    const viewer = view(fieldL)
    return lens(
        viewer,
        ap => value => viewer(ap) !== value ? fixOnEdition({...ap, [key]: value}) : ap
    )
}

export const newAppointment = (reference: string, props: MonthlyAppointment): Appointment => ({
    resourceType: "Appointment",
    ...props,
    participant: [{status: "accepted", actor: {reference}}]
})

export type AppointmentLenses = {
    status: Lens<Appointment, Status>,
    selfParticipantStatus: Lens<Appointment, ParticipantStatus>,
    participants: Lens<Appointment, Participant[]>,
    description: Lens<Appointment, string>,
    start: Lens<Appointment, string>,
    end: Lens<Appointment, string>
}

export const makeLenses = (reference: string): AppointmentLenses => {
    const selfParticipantStatus2L = compL(participantsL, selfParticipantStatusL(reference))
    return {
        status: statusL,
        selfParticipantStatus: selfParticipantStatus2L,
        participants: propL("participant"),
        description: editL('description', selfParticipantStatus2L),
        start: editL('start', selfParticipantStatus2L),
        end: editL('end', selfParticipantStatus2L),
    }
}