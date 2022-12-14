import {FC} from "react";
import {MonthlyAppointment} from "../models/appointment/monthly";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {Screens} from "../containers/App";
import {Button, Card, Text} from "react-native-paper";
import {dateFormat} from "../utils/date";

export const AppointmentList: FC<{date: Date, appointments: MonthlyAppointment[]}> =
    ({date, appointments}) => {
        const {navigate} = useNavigation<NavigationProp<Screens>>()
        return <>
            {appointments
                .filter(appointment => dateFormat(new Date(appointment.start!)) === dateFormat(date))
                .map(appointment => <Card mode="outlined" key={appointment.id}>
                    <Card.Title title={`N° ${appointment.id}`} />
                    <Card.Content>
                        <Text>{JSON.stringify(appointment, null, 2)}</Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={() => navigate("Appointment", {appointment})}>See</Button>
                    </Card.Actions>
                </Card>)}
        </>
    }
