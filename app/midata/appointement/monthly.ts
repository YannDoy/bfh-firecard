import {Session} from "../../hooks/login";
import {authFetch} from "../client";

export type Status
    = 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled'

export type AppointmentSearchSet = { entry: { resource: { id: string, status: Status, start?: string, end?: string } }[] }
export type Monthly = {id: string, start: Date, end: Date}[]
export type MonthlyAppointmentsCommand = {session: Session, signal?: AbortSignal|undefined, monthNum: number}

export const month2IsoDate = (monthNum: number): string =>
    `${String(Math.floor(monthNum / 12))}-${String((monthNum % 12) + 1).padStart(2, '0')}-01`

export const month2Date = (monthNum: number): Date =>
    new Date(Math.floor(monthNum / 12), (monthNum % 12) + 1, 1)

export const getMonthlyAppointments = async ({session, signal, monthNum}: MonthlyAppointmentsCommand)
    : Promise<Monthly> =>
        authFetch<AppointmentSearchSet, never, Monthly>({
            session,
            signal,
            method: "GET",
            path: `/Appointment?date=le${month2IsoDate(monthNum)}&date=gt${month2IsoDate(monthNum + 1)}`,
            decode: (input: AppointmentSearchSet) => {
                console.log(input)
                return (input.entry ?? [])
                    .filter(entry => entry.resource.start !== undefined && entry.resource.end !== undefined)
                    .map(entry => ({
                        id: entry.resource.id,
                        start: new Date(Date.parse(entry.resource.start!)),
                        end: new Date(Date.parse(entry.resource.end!))
                    }))
            }
        })