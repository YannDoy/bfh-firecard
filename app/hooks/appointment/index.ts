import {appointmentMachine} from "./machine";
import {fetcher} from "../../models/oauth";
import {mapMonthlyAppointments, monthlyAppointmentUrl, MonthlyAppointment} from "../../models/appointment/monthly";
import {AppointmentContext} from "./context";
import useSWR from "swr/immutable";
import {useSWRConfig} from "swr";
import {useMidataSession} from "../midata";
import {useMachine} from "../robot";
import {setDate} from "../../utils/date";
import {EMPTY_SESSION} from "../../models/session";

export function useMonthlyAppointments(date: Date|undefined) {
    const oauth = useMidataSession()
    const uri = monthlyAppointmentUrl(date ? setDate(date, 1) : undefined)
    return useSWR<MonthlyAppointment[]>(
        oauth !== EMPTY_SESSION && uri !== null
            ? [oauth, uri, mapMonthlyAppointments]
            : null,
        fetcher,
        {revalidateIfStale: true}
    )
}

export function useAppointmentMachine(short?: MonthlyAppointment|undefined) {
    const oauth = useMidataSession()
    const {mutate} = useSWRConfig()
    return useMachine(appointmentMachine,
        AppointmentContext.of(oauth, mutate, short ?? {}))
}