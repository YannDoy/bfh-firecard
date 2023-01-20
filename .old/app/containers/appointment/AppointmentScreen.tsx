import {FC, useState} from "react";
import {ScreenProp} from "../App";
import {Avatar, Button, Card, Chip, List, Switch, Text, TextInput} from "react-native-paper";
import {Alert, ScrollView, View} from "react-native";
import {useAppointmentMachine} from "../../hooks/appointment";
import {ParticipantListInput} from "../../components/ParticipantListInput";

export const AppointmentScreen: FC<ScreenProp<"Appointment">> = ({route: {params: {appointment} = {}}}) => {
    const machine = useAppointmentMachine(appointment)
    const [ok, setOk] = useState(false)
    return <ScrollView>
        <Card mode="outlined">
            <Card.Title title={`#${machine.context.draft.id ?? 'New'}`} />
            <Card.Content>
                <TextInput
                    label="Description"
                    disabled={machine.state !== "edit"}
                    onChangeText={value => machine.send("input", {key: "description", value})}
                    value={machine.context.description} />
                <TextInput
                    label="Start"
                    disabled={machine.state !== "edit"}
                    onChangeText={value => machine.send("input", {key: "start", value})}
                    value={machine.context.start} />
                <TextInput
                    label="End"
                    disabled={machine.state !== "edit"}
                    onChangeText={value => machine.send("input", {key: "end", value})}
                    value={machine.context.end} />
                <ParticipantListInput
                    label="Participants"
                    participant={machine.context.draft.participant ?? []}
                    onChange={participants => machine.send("invite", {participants})} />
            </Card.Content>
            <Card.Actions>
                {machine.can('accept') &&
                    <Button onPress={() => machine.send('accept')}>Accept</Button>}
                {machine.can('decline') &&
                    <Button onPress={() => machine.send('decline')}>Decline</Button>}
                {machine.can('sync') &&
                    <Button onPress={() => machine.send('sync')}>Save</Button>}
                {machine.can('reset') &&
                    <Button onPress={() => machine.send('reset')}>Reset</Button>}
                {machine.can('cancel') &&
                    <Button onPress={() => machine.send('cancel')}>Cancel</Button>}
                {machine.can('reload') &&
                    <Button onPress={() => machine.send('reload')}>Reload</Button>}
            </Card.Actions>
        </Card>
    </ScrollView>
}


