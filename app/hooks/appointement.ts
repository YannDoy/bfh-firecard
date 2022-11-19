import {useQuery} from "@tanstack/react-query";
import {getMonthlyAppointments} from "../midata/appointement/monthly";
import {useActiveSession} from "./login";
import {getAppointment} from "../midata/appointement/appointement";

export const useMonthlyAppointments = (monthNum: number|undefined) => {
    const session = useActiveSession()
    return useQuery({
        enabled: monthNum !== undefined,
        queryKey: [`monthly-appointments`, monthNum],
        queryFn: (context) => getMonthlyAppointments({
            session,
            signal: context.signal,
            monthNum: monthNum!
        })
    })
}

export const useAppointment = (appointmentId: string|undefined) => {
    const session = useActiveSession()
    return useQuery({
        enabled: appointmentId !== undefined,
        queryKey: [`appointment`, appointmentId],
        queryFn: (context) => getAppointment({
            session,
            signal: context.signal,
            appointmentId: appointmentId!
        })
    })
}