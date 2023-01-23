import {MidataType} from "./types";

export function invite(appointment: MidataType["Appointment"], email: string): MidataType["Appointment"] {
    return {
        ...appointment,
        participant: [...(appointment.participant ?? []), {
            status: "tentative",
            actor: {
                identifier: {
                    system: "http://midata.coop/identifier/patient-login",
                    value: email
                }
            }
        }]
    }
}

export function setStatus(appointment: MidataType["Appointment"],
                          userReference: `/${MidataType['ParticipantType']}/${string}`,
                          status: MidataType["ParticipantStatus"]): MidataType["Appointment"] {
    return {
        ...appointment,
        participant: (appointment.participant ?? [])
            .map((participant) =>
                participant.actor?.reference === userReference.replace("Patient/", "")
                    ? ({...participant, status})
                    : participant)
    }
}

export function edit(appointment: MidataType["Appointment"],
                     userReference: `/${MidataType['ParticipantType']}/${string}`,
                     field: "description" | "start" | "end",
                     value: string) {
    return {
        ...appointment,
        [field]: value,
        participant: (appointment.participant ?? [])
            .map(participant => participant.actor?.reference !== userReference.replace("Patient/", "")
                ? {...participant, status: "tentative"}
                : participant)
    }
}