import {FC} from "react";
import {MonthlyAppointment} from "../models/appointment/monthly";
import {dateFormat, dateTimeFormat, setYearMonthDate} from "../utils/date";
import {Text} from "react-native-paper";
import ReactNativeCalendarStrip from "react-native-calendar-strip";

export const AppointmentCalendar: FC<{
    appointments: MonthlyAppointment[]|undefined,
    isLoading: boolean,
    date: Date,
    onDateChange: (date: Date) => void
}> = ({appointments, isLoading, date, onDateChange}) => {

    /*
    const onMonthChange = (change: DateData) =>
        onDateChange(setYearMonthDate(date, change.year, change.month, 1))

    const onDayPress = (change: DateData) =>
        onDateChange(setYearMonthDate(date, change.year, change.month, change.day))
*/

    const marksDates = (appointments ?? [])
        .filter(appointment => appointment.start !== undefined)
        .reduce((acc: any, appointment) => {
            const day = dateFormat(date)
            const key = dateFormat(new Date(appointment.start!))
            return {
                ...acc,
                [key]: { marked: true, selected: key === day }
            }
        }, {})

    return <ReactNativeCalendarStrip
        scrollable={true}
        style={{backgroundColor: "royalblue"}} />
    return <Text>{JSON.stringify(marksDates)}</Text>
    /*
    return <Calendar
        displayLoadingIndicator={isLoading}
        enableSwipeMonths={true}
        initialDate={dateTimeFormat(date)}
        markedDates={marksDates}
        onDayPress={onDayPress}
        onMonthChange={onMonthChange} />*/
}