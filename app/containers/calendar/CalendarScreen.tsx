import {FC, useState} from "react";
import {ScreenProp, Screens} from "../App";
import {ScrollView, StyleSheet} from "react-native";
import {AppointmentList} from "../../components/AppointmentList";
import {AppointmentCalendar} from "../../components/AppointmentCalendar";
import {FAB} from "react-native-paper";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {useMonthlyAppointments} from "../../hooks/appointment";
import {addMinutes, dateTimeFormat} from "../../utils/date";
import {MonthlyAppointment} from "../../models/appointment/monthly";

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})

export const CalendarScreen: FC<ScreenProp<"Calendar">> = () => {
    const {navigate} = useNavigation<NavigationProp<Screens>>()
    const [date, setDate] = useState(new Date())
    const {data: appointments, isValidating} = useMonthlyAppointments(date)
    return <>
        <ScrollView>
            <AppointmentCalendar
                appointments={appointments ?? []}
                isLoading={isValidating}
                date={date}
                onDateChange={setDate} />
            <AppointmentList
                date={date}
                appointments={appointments ?? [] as MonthlyAppointment[]} />
        </ScrollView>
        <FAB style={styles.fab} icon="plus" onPress={() => navigate("Appointment", {
            appointment: { start: dateTimeFormat(date), end: dateTimeFormat(addMinutes(date, 15)) }
        })} />
    </>
}
