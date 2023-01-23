import * as O from "optics-ts"
import {MidataType} from "./types";
import dayjs, {Dayjs} from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc)

export const appointmentsL = O.optic<MidataType["AppointmentSearchBundle"]>()
    .prop("entry")
    .valueOr([])
    .elems()
    .prop("resource")

export const idL = O.optic<MidataType["Appointment"]>().prop("id")

export const descriptionL = O.optic<MidataType["Appointment"]>()
    .lens(app => app.description ?? app.comment,
        (app, value) => app.description
                ? {...app, description: value}
                : {...app, comment: value})
    .optional()

export const startL = O.optic<MidataType["Appointment"]>()
    .prop("start")
    .optional()
    .iso(dayjs, date => date.format())

export const endL = O.optic<MidataType["Appointment"]>()
    .prop("end")
    .optional()
    .iso(dayjs, date => date.format())

export const participantL = O.optic<MidataType["Appointment"]>()
    .prop("participant")
    .valueOr([])
    .elems()

export const selfL = (reference: string) => participantL
    .when(participant => participant.actor?.reference === reference)

// @ts-ignore
const clearStatusL = O.set(participantL.prop("status"))("tentative")