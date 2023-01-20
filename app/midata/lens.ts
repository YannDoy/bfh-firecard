import * as O from "optics-ts"
import {MidataTypes} from "./types";

const INVITATION = "http://midata.coop/identifier/patient-login"

export const orElse = <A, B>(lens: Optic) =>


const dataIso = O.optic<MidataTypes["instant"]>()
    .iso(
        (instant: MidataTypes["instant"]): Date => {
            const match = instant.match(/^(.+)[+-](\d{2}):(\d{2})$/)
            if (match === null) throw new Error("invalid instant")
            const date = new Date(`${match[1]}Z`)
            const offset = date.getTimezoneOffset()
            date.setHours(date.getHours() - parseInt(match[2]) + Math.floor(offset / 60))
            date.setMinutes(date.getMinutes() - parseInt(match[3]) + (offset % 60))
            return date
        },
        (date: Date) => {
        const offset = date.getTimezoneOffset()
        const abs = Math.abs(offset)
        const hour = Math.floor(abs / 60)
        const min = abs % 60
        const sign = offset < 0 ? "+" : "-"
        return date.toISOString()
            .replace(`Z`,
                `${sign}${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`) as any
    })


console.log(O.get(dataIso)("2022-10-23T23:19:20.000+02:00" as MidataTypes["instant"]))
