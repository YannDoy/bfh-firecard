import {FC, useState} from "react";
import {useMonthlyAppointments} from "../hooks/appointement";
import XDate from "xdate";
import {Calendar} from "react-native-calendars";
import {month2Date} from "../midata/appointement/monthly";

export const AppointmentCalendar: FC = () => {
    const date = new Date()

    const [monthNum, setMonthNum] = useState<number>(date.getFullYear() * 12 + date.getMonth())
    const monthlyAppointments = useMonthlyAppointments(monthNum)

    const marks = monthlyAppointments.isFetched
        ? monthlyAppointments.data!.reduce((acc, item) =>
            ({...acc, [item.start.toDateString()] : {marked: true} }), {})
        : {}

    return <Calendar
        month={monthNum ? new XDate(month2Date(monthNum)) : undefined}
        onMonthChange={change => setMonthNum(change.year * 12 + (change.month - 1))}
        markedDates={marks}
        onDayPress={(date) => console.log(date)} />
}