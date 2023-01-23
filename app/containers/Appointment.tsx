import {FC} from "react";
import {WithAppNavs} from "./index";
import {ActivityIndicator, Card, Text, TextInput} from "react-native-paper";
import {SafeAreaView, ScrollView} from "react-native";
import {
    MidataType,
    useMidataFetch,
    useMidataMutate,
    useMidataResource,
    useMidataUserReference
} from "../components/midata";
import {AppointmentForm} from "../components/appointment-form";
import dayjs from "dayjs";

export const Appointment: FC<WithAppNavs<"Appointment">> = ({route: {params: {id, date}}}) => {
    const userReference = useMidataUserReference()
    const mutate = useMidataMutate()
    const midataFetch = useMidataFetch()
    const {isLoading, isValidating, data} =
        useMidataResource<MidataType["Appointment"]>(id && `/Appointment/${id}`)

    return <SafeAreaView>
        <ScrollView>
            {(isLoading || isValidating) &&
                <ActivityIndicator />}
            <AppointmentForm
                userReference={userReference}
                initialMode={id ? "view" : "edit"}
                initialData={data ?? {
                    resourceType: "Appointment",
                    status: "proposed",
                    start: dayjs(date).toISOString(),
                    end: dayjs(date).add(15, "minutes").toISOString(),
                    participant: [
                        {
                            status: "tentative",
                            actor: {
                                reference:
                                    userReference.replace("Patient/", "") as any
                            }
                        }
                    ]
                }}
                onPersist={(edit: MidataType["Appointment"]) => midataFetch(
                    id ? "PUT" : "POST",
                    id ? `/Appointment/${id}` : `/Appointment`,
                    edit
                ).then(result => Promise.all([
                    mutate(key => key !== `/Appointment/${id}`),
                    mutate(`/Appointment/${id}`, result, {revalidate: true})
                ])).then(result => {})} />
        </ScrollView>
    </SafeAreaView>
}