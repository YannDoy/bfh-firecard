import * as O from "optics-ts"

export type ParticipantStatus
    = "accepted" | "declined" | "tentative" | "error"


export type Participant = {
    status?: ParticipantStatus,
    actor: {
        reference?: string,
        display?: string,
        identifier?: { system: typeof INVITATION, value: Email }
    }
}

type Email = {readonly tag?: unique symbol} & string

const isEmail = RegExp.prototype.test.bind(/^[^@]+@[^@]+\.[^@]+$/)



const emailP = O.optic_<Participant>()
    .prop("actor")
    .prop("identifier")
    .optional()
    .when((ctx) => ctx.system === INVITATION)
    .prop("value")
    .guard(isEmail as (txt: string) => txt is Email)

console.log(O.preview(emailP)({
    actor: {
        identifier: {
            system: INVITATION,
            value: "welcome"
        }
    }
}))

/*
const emailP = O.compose(
    O.prop("actor"),
    O.prop("identifier"),
    O.optional,
    O.guard((ctx: unknown): ctx is NonNullable<Model["actor"]["identifier"]> =>
        typeof ctx === "object"
            && ctx !== null
            && typeof (ctx as any).value === "string"
            && (ctx as any).system === INVITATION),
    O.prop("value"),
    O.guard(isEmail as (txt: string) => txt is Email)
)

const referenceP = O.compose(
    O.prop("actor"),
    O.prop("reference"),
    O.optional
)

const displayP = O.compose(
    O.prop("actor"),
    O.prop("display"),
    O.optional
)

const statusL = O.compose(
    O.prop("status"),
    O.valueOr("tentative" as ParticipantStatus)
)



/*
export const isEmail = RegExp.prototype.test.bind(/^[^@]+@[^@]+\.[^@]+$/)


export const participantName = (participant: Model) => participant.actor.display
    ?? participant.actor.identifier?.value
    ?? participant.actor.reference
    ?? "N/A"

export const participantIndexForReference = (reference: string, participants: Model[]) =>
    participants.findIndex(participant => participant.actor.reference === reference)
        ?? participants.length

export const participantForEmail = (email: string): Model => ({
    status: "tentative",
    actor: {
        identifier: {
            system: INVITATION,
            value: email
        }
    }
})



const participantNameL: Lens<Model, string> = lens.png(s => s.actor.display
    ?? s.actor.identifier?.value
    ?? s.actor.reference
    ?? "N/A")

const selfParticipantL = (reference: string): Lens<Model[], Model> => lens.png(
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

export const selfParticipantStatusL = (reference: string): Lens<Model[], ParticipantStatus> => compL(
    selfParticipantL(reference),
    propL("status", "tentative") as Lens<Model, ParticipantStatus>
)

export const isSettledL: Lens<Model[], boolean> = lens.png(
    participants => participants.every(p => p.status !== "tentative"),
    participants => bool => bool ? participants : participants.map(p => ({...p, status: "tentative"})))

export const isCancelledL: Lens<Model[], boolean> = lens.png(
    participants => participants.some(p => p.status === "declined"))

export const getName = view(participantNameL)

export const allParticipantsNameL = lens.png<Model[], string[]>(
    participants => participants.map(getName),
    participants => names =>  {
        const compares = participants.map(getName)
        if (names.length === compares.length &&
            compares.every((n, i) => n === names[i])) {
            return participants
        }

        let i = 0;
        const copy: Model[] = []
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
*/