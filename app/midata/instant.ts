import * as O from "optics-ts"

export function instant2date(instant: string): Date {
    return new Date(Date.parse(instant))
}

export function date2instant(date: Date): string {
    const copy = new Date(date)
    const offset = date.getTimezoneOffset()
    const sign   = offset < 0 ? "+" : "-"
    const hours  = String(Math.abs(offset) / 60 | 0).padStart(2, '0')
    const mins   = String(Math.abs(offset) % 60 | 0).padStart(2, '0')
    copy.setUTCMinutes(copy.getUTCMinutes() - offset)
    return `${copy.toISOString().replace("Z", "")}${sign}${hours}:${mins}`
}

export const dateInstantIso = O.optic<string>().iso(instant2date, date2instant)