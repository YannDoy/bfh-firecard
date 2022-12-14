import {compL, Lens, lens, propL, view} from "../utils/lenses";

export type ParticipantStatus
    = "accepted" | "declined" | "tentative" | "error"

const INVITATION = "http://midata.coop/identifier/patient-login-or-invitation";

export type Participant = {
    status?: ParticipantStatus,
    actor: {
        reference?: string,
        display?: string,
        identifier?: { system: typeof INVITATION, value: string }
    }
}

export const isEmail = RegExp.prototype.test.bind(/^[^@]+@[^@]+\.[^@]+$/)

export const participantName = (participant: Participant) => participant.actor.display
    ?? participant.actor.identifier?.value
    ?? participant.actor.reference
    ?? "N/A"

export const participantIndexForReference = (reference: string, participants: Participant[]) =>
    participants.findIndex(participant => participant.actor.reference === reference)
        ?? participants.length

export const participantForEmail = (email: string): Participant => ({
    status: "tentative",
    actor: {
        identifier: {
            system: INVITATION,
            value: email
        }
    }
})



const participantNameL: Lens<Participant, string> = lens(s => s.actor.display
    ?? s.actor.identifier?.value
    ?? s.actor.reference
    ?? "N/A")

const selfParticipantL = (reference: string): Lens<Participant[], Participant> => lens(
    participants => participants.find(p => p.actor.reference === reference)
        ?? {status: "tentative", actor: { reference }},
    participants => participant => {
        const index = participants.findIndex(candidate => candidate.actor.reference === participant.actor.reference)
        if (index === -1) return [...participants, participant]
        if (participants[index] === participant) return participants
        const copy = [...participants]
        copy[index] = participant
        return copy
    }
)

export const selfParticipantStatusL = (reference: string): Lens<Participant[], ParticipantStatus> => compL(
    selfParticipantL(reference),
    propL("status", "tentative") as Lens<Participant, ParticipantStatus>
)

export const isSettledL: Lens<Participant[], boolean> = lens(
    participants => participants.every(p => p.status !== "tentative"),
    participants => bool => bool ? participants : participants.map(p => ({...p, status: "tentative"})))

export const isCancelledL: Lens<Participant[], boolean> = lens(
    participants => participants.some(p => p.status === "declined"))

export const getName = view(participantNameL)

export const allParticipantsNameL = lens<Participant[], string[]>(
    participants => participants.map(getName),
    participants => names =>  {
        const compares = participants.map(getName)
        if (names.length === compares.length &&
            compares.every((n, i) => n === names[i])) {
            return participants
        }

        let i = 0;
        const copy: Participant[] = []
        for (const name of names) {
            const compare = participants[i]
            if (isEmail(name) && (compare === undefined || getName(compare) !== name)) {
                copy.push({
                    status: "tentative",
                    actor: {
                        identifier: {system: INVITATION, value: name}
                    }
                })
                continue
            }
            if (getName(compare) === name) {
                copy.push(compare)
            }
            i++
        }
        return copy
    }
)
