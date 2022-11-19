import {FC} from "react";
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";
import {Appbar, Button, Divider, Provider as PaperProvider, Text} from "react-native-paper"
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ScrollView} from "react-native";
import {useLogin} from "./hooks/login";
import {AppointmentCalendar} from "./components/AppointmentCalendar";

const AppContainer: FC = () => {
    const login = useLogin()

    return <>
        <Appbar.Header>
            <Appbar.Content title="Firecard" />
            {login.session !== null && <Button children={"Logout"} onPress={() => login.revoke()} />}
        </Appbar.Header>
        {login.session === null
            ? <Button onPress={() => login.authorize()} loading={login.isLoading} children={"Login"}/>
            : <AppointmentCalendar />}
    </>
}

export const App: FC = () => {
    const queryClient = new QueryClient()

    return <SafeAreaProvider>
        <PaperProvider>
            <QueryClientProvider client={queryClient}>
                <AppContainer />
            </QueryClientProvider>
        </PaperProvider>
    </SafeAreaProvider>
}