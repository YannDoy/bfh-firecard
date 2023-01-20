import * as O from "optics-ts";

export const INVITATION = "http://midata.coop/identifier/patient-login-or-invitation";

export type Participant = {
    status?: "accepted" | "declined" | "tentative" | "error",
    actor: {
        reference?: string,
        display?: string,
        identifier?: { system: typeof INVITATION, value: Email }
    }
}

export type Email = {readonly tag?: unique symbol} & string
export const isEmail = RegExp.prototype.test.bind(/^[^@]+@[^@]+\.[^@]+$/)

const inviteS = O.optic<Participant[]>()
    .elems()
    .iso(p => p.actor.identifier?.value ?? "",
        e => ({status: "tentative", actor: { identifier: { system: INVITATION, value: e } }}))
    .when(isEmail)
    .appendTo()

console.log(O.set(inviteS)("doy.yann@hotmail.com")([]))



export const emailP = O.optic<Participant>()
    .path('actor.identifier')
    .optional()
    .when((ctx) => ctx.system === INVITATION)
    .prop("value")
    .guard(isEmail as (txt: string) => txt is Email)

const getEmail = O.preview(emailP)

export const nameP = O.optic<Participant>()
    .to(p => p.actor.display ?? getEmail(p) ?? p.actor.reference)
    .optional()

export const statusL = O.optic<Participant>()
    .prop("status")
    .valueOr("tentative")
