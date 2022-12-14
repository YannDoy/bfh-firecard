import {FC, useState} from "react";
import {getName, isEmail, Participant} from "../models/participant";
import {Button, IconButton, List, TextInput} from "react-native-paper";

type ParticipantListInputProp = {
    label: string
    participant: Participant[]
    onChange: (participants: Participant[]) => void
}

export const ParticipantListInput: FC<ParticipantListInputProp> = ({label, participant, onChange}) => {
    const [invite, setInvite] = useState("")

    return <List.Accordion title={label}>
        {participant.map((participant, i) => <List.Item
            key={i}
            title={getName(participant)}
            right={(props: any) => <IconButton
                {...props}
                onPress={() => console.log("kick", participant, i)}
                icon="delete" />}
            left={() =>
                <List.Icon icon={
                (participant.status === "accepted" && "account-check") ||
                (participant.status === "declined" && "account-cancel") ||
                "account-clock"
            } />}
        />)}
        <TextInput label="Invite"
                   value={invite}
                   error={invite !== "" && !isEmail(invite)}
                   onSubmitEditing={() => {
                       if (isEmail(invite)) {
                           console.log([...participant, {
                               status: "tentative",
                               actor: {
                                   identifier: {
                                       system: "http://midata.coop/identifier/patient-login-or-invitation",
                                       value: invite
                                   }
                               }
                           }])
                           onChange([...participant, {
                               status: "tentative",
                               actor: {
                                   identifier: {
                                       system: "http://midata.coop/identifier/patient-login-or-invitation",
                                       value: invite
                                   }
                               }
                           }])
                           setInvite("")
                       }
                   }}
                   onChangeText={value => setInvite(value.trim())}/>
    </List.Accordion>
}