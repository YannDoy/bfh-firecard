import {FC, useCallback, useState} from "react";
import {WithAppNavs} from "./index";
import {SafeAreaView, ScrollView} from "react-native";
import {Calendar, DateData} from "@wellin/react-native-calendars"

export const Agenda: FC<WithAppNavs<"Agenda">> = () => {
    const [date, setDate] = useState<Date>(new Date())

    const onMonthChange = useCallback((change: DateData) =>
        setDate(new Date(change.year, change.month, 1, date.getHours(), date.getMinutes(), 0)), [])
    const onDayPress = useCallback((change: DateData) =>
        setDate(new Date(change.year, change.month, change.day, date.getHours(), date.getMinutes(), 0)), [])

    /*
    const marksDates = (appointments ?? [])
        .filter(appointments => appointments.start !== undefined)
        .reduce((acc: any, appointments) => {
            const day = dateFormat(date)
            const key = dateFormat(new Date(appointments.start!))
            return {
                ...acc,
                [key]: { marked: true, selected: key === day }
            }
        }, {})

    return <ReactNativeCalendarStrip
        scrollable={true}
        style={{backgroundColor: "royalblue"}} />
    return <Text>{JSON.stringify(marksDates)}</Text>
    /*/

    return <SafeAreaView>
        <ScrollView>
            <Calendar
                displayLoadingIndicator={false}
                enableSwipeMonths={true}
                initialDate={date.toDateString()}
                markedDates={{'2023-01-04': {marked: true, selected: false}}}
                onDayPress={onDayPress}
                onMonthChange={onMonthChange} />
        </ScrollView>
    </SafeAreaView>
}