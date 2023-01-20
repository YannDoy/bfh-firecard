import * as O from "optics-ts"

export type Bundle = {
    resourceType: "Bundle",
    entry: {resource: any}[]
}

export type Appointment = {
    resourceType: "Appointment",
    id?: string,
    meta?: { versionId: string, lastUpdated?: string },
    status?: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled',
    description?: string,
    start?: string,
    end?: string,
    participant?: Participant[]
}

export type Participant = {
    status?: "accepted" | "declined" | "tentative" | "error",
    actor: {
        reference?: string,
        display?: string,
        identifier?: { system?: string, value?: string }
    }
}

type ShortAppointment = {
    id: string,
    status: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled',
    start: string,
    end: string,
}

const shortAppointmentFromBundle = O.collect(
    O.optic<Bundle>()
        .prop("entry")
        .elems()
        .prop("resource")
        .guard((i: any): i is ShortAppointment => i.resourceType === "Appointment"
            && i.id !== undefined
            && i.status !== undefined
            && i.start !== undefined
            && i.end !== undefined)
        .pick(['id', 'status', 'start', 'end']))

const dateL = O.optic<string>().iso<Date>(
    i => new Date(i),
    i => i.toISOString()
        .replace("Z", i.getTimezoneOffset() === 60 ? "+01:00" : "+02:00"))

const startL = O.optic<Appointment>()
    .prop("start")
    .optional()
    .compose(dateL)

const endL = O.optic<Appointment>()
    .prop("end")
    .optional()
    .compose(dateL)

const descriptionL = O.optic<Appointment>().prop("description")
    .optional()
    .iso(i => i.trim(), i => i.trim())

const selfStatusL = (reference: string) => O.optic<Appointment>()
    .prop("participant")
    .valueOr([])
    .find(i => i.actor.reference === reference)
    .prop("status")

const clearAllParticipantStatus = O.set(O.optic<Appointment>()
    .prop("participant")
    .valueOr([])
    .elems()
    .prop("status"))("tentative")




