import {FC, useState} from "react";
import {WithAppNavs} from ".";
import {SafeAreaView, ScrollView} from "react-native";
import {MidataType, useMidataResource} from "../components/midata";
import {ActivityIndicator, Card, List, Text} from "react-native-paper";
import {Calendar as RNCalendar, DateData} from "react-native-calendars";
import dayjs, {Dayjs} from 'dayjs';
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)



export const Agenda: FC<WithAppNavs<"Agenda">> = ({navigation: {navigate}}) => {
    const [selectedDay, setSelectedDay] = useState<Dayjs>(dayjs());

    const onDayChange = (date: DateData) => {
        setSelectedDay(dayjs(date.dateString)
            .set('hour', selectedDay.hour())
            .set('minute', selectedDay.minute()))
    }

    const selectedFormatted = selectedDay
        .local()
        .format("YYYY-MM-DD")

    const firstDayOnMonth = selectedDay
        .startOf('month')
        .format('YYYY-MM-DD')

    const firstDayOnNext = selectedDay.clone()
        .add(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD')

    const {isLoading, data} = useMidataResource<MidataType["AppointmentSearchBundle"]>(
        `/Appointment?date=ge${firstDayOnMonth}&date=lt${firstDayOnNext}`,
        { refreshInterval: 60 * 1000 } // 1 minutes of cache
    )

    const appointments = ((data && data.entry) ?? [])
        .map((i: any) => i.resource)
        .filter((i: MidataType["Appointment"]) => i.start !== undefined)

    const markedDates = appointments
        .reduce((acc: any, i: MidataType["Appointment"]) => {
            const start = dayjs(i.start!)
            const formatted = start.format("YYYY-MM-DD")
            acc[formatted] = acc[formatted] || {marked: formatted !== selectedFormatted}
            return acc
        }, {[selectedFormatted]: {selected: true}})

    const events = appointments
        .filter(event => dayjs(event.start!).format('YYYY-MM-DD') === selectedFormatted)
        .map(event => <List.Item
            key={event.id}
            title={event.id}
            onPress={() => navigate("Appointment", {id: event.id})}
            description={event.description ?? event.comment} />)

    return <SafeAreaView>
        <RNCalendar
            date={selectedFormatted}
            markedDates={markedDates}
            onDayPress={onDayChange}
            onMonthChange={onDayChange} />
        <ScrollView>
            {isLoading && <ActivityIndicator />}
            {events}
        </ScrollView>
    </SafeAreaView>
}