import {FC, useState} from "react";
import {MidataType} from "../midata";
import {useStateMachine} from "@rkrupinski/use-state-machine";
import {edit, invite, setStatus} from "../midata/_internal/utils";
import {ActivityIndicator, Button, Card, List, TextInput} from "react-native-paper";
import dayjs from "dayjs";
import {View} from "react-native";

export type AppointmentFormProps = {
    userReference: string
    initialMode: "view" | "edit" | "save" | "error",
    initialData: MidataType["Appointment"]
    onPersist: (changed: MidataType["Appointment"]) => Promise<void>
}

type Input = {field: 'description' | 'start' | 'end', value: string}
type Invite = {email: string}

export const AppointmentForm: FC<AppointmentFormProps> = ({
                      userReference,
                      initialMode,
                      initialData,
                      onPersist}) => {
    const [email, setEmail] = useState("")

    const [state, send] = useStateMachine({
        initial: initialMode,
        context: initialData,
        states: {
            view: {
                effect({ setContext, event }) {
                    if (event.type === "reset") {
                        setContext(initialData as any)
                    }
                },
                on: {
                    edit: "edit"
                }
            },
            edit: {
                effect({ setContext, event }) {
                    if (event.type === "input") {
                        const field = (event.payload as Input).field
                        const value = (event.payload as Input).value
                        setContext(context => edit(context, userReference as any, field, value) as any)
                    } else if (event.type === "invite") {
                        setContext(context => invite(context, (event.payload as Invite).email) as any)
                    } else if (event.type === "accept") {
                        setContext(context => setStatus(context, userReference as any, "accepted") as any)
                    } else if (event.type === "decline") {
                        setContext(context => setStatus(context, userReference as any, "declined") as any)
                    }
                },
                on: {
                    input: "edit",
                    invite: "edit",
                    accept: {
                        target: "edit",
                        guard({context}) {
                            return context.participant
                                ?.find(p => p.actor?.reference === userReference.replace("Patient/", ""))
                                ?.status !== "accepted"
                        }
                    },
                    decline: {
                        target: "edit",
                        guard({context}) {
                            return context.participant
                                ?.find(p => p.actor?.reference === userReference.replace("Patient/", ""))
                                ?.status !== "declined"
                        }
                    },
                    reset: "view",
                    save: "save"
                }
            },
            save: {
                effect({ context, send }) {
                    onPersist(context as MidataType["Appointment"])
                        .then(() => send("view"))
                        .catch(error => send("error"))
                },
                on: {
                    view: "view",
                    error: "error"
                }
            },
            error: {
                on: {
                    input: "edit",
                    invite: "edit",
                    reset: "view",
                    save: "save"
                }
            }
        }
    })

    return <Card>
        <Card.Title title={state.context.id} />
        <Card.Content>
            {state.value === "save" &&
                <ActivityIndicator />}
            <TextInput
                label="Description"
                disabled={!state.nextEvents.includes("input")}
                value={state.context.description}
                onChangeText={value => send({type: "input", payload: {field: "description", value}})}
            />
            <TextInput
                label="Start"
                disabled={!state.nextEvents.includes("input")}
                value={dayjs(state.context.start).local().format()}
                onChangeText={value => send({type: "input", payload: {field: "start", value}})}
            />
            <TextInput
                label="End"
                disabled={!state.nextEvents.includes("input")}
                value={dayjs(state.context.end).local().format()}
                onChangeText={value => send({type: "input", payload: {field: "end", value}})}
            />
            {state.context.participant?.map((p, i) =>
            <List.Item
                key={i}
                title={`${p.status}: ${p.actor?.display
                    ?? p.actor?.identifier?.value
                    ?? (p.actor?.reference === userReference.replace("Patient/", "")
                        ? "me" : p.actor?.reference)}`}
            />)}
            {state.nextEvents.includes("invite") &&
                <View>
                    <TextInput
                        label="email"
                        value={email}
                        onChangeText={email => setEmail(email)} />
                    <Button onPress={() => {
                        send({type: "invite", payload: {email}})
                        setEmail("")
                    }}>Invite</Button>
                </View>
            }
        </Card.Content>
        <Card.Actions>
            {state.nextEvents.includes("edit") &&
                <Button onPress={() => send("edit")}>Edit</Button>}
            {state.nextEvents.includes("accept") &&
                <Button onPress={() => send("accept")}>Accept</Button>}
            {state.nextEvents.includes("decline") &&
                <Button onPress={() => send("decline")}>Decline</Button>}
            {state.nextEvents.includes("save") &&
                <Button onPress={() => send("save")}>Save</Button>}
            {state.nextEvents.includes("reset") &&
                <Button onPress={() => send("save")}>Reset</Button>}
        </Card.Actions>
    </Card>
}