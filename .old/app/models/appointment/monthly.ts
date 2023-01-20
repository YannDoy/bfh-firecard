import {Status} from "./index";
import {addMonth, dateFormat, setDate} from "../../utils/date";

export type MonthlyAppointment =
    { id?: string, status?: Status, start?: string, end?: string }

type MonthlyAppointments =
    { entry: { resource: MonthlyAppointment }[] }

export const monthlyAppointmentUrl = (date: Date|undefined): string|null =>
    date !== undefined
        ? `/Appointment?date=ge${dateFormat(setDate(date, 1))}&date=lt${dateFormat(addMonth(setDate(date, 1), 1))}`
        : null

export const mapMonthlyAppointments = (response: MonthlyAppointments): MonthlyAppointment[] =>
    (response.entry ?? [])
        .map(({resource}) => ({
            id: resource.id,
            start: resource.start,
            end: resource.end,
            status: resource.status
        }))
        .filter(i => ["proposed", "pending", "booked", "arrived", "cancelled"].includes(i.status ?? ""))
