import {createContext, FC, useEffect, useState} from "react";
import {RouteProp} from "@react-navigation/core/src/types";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {HomeScreen} from "./HomeScreen";
import {AppointmentScreen} from "./appointment/AppointmentScreen";
import {Provider as PaperProvider, Text} from "react-native-paper";
import {MonthlyAppointment} from "../models/appointment/monthly";
import {SWRConfig} from "swr";
import "react-native-screens"
import "react-native-gesture-handler"
import {oauthAuthorize} from "../models/oauth";
import {EMPTY_SESSION, Session} from "../models/session";

export type ScreenProp<Route extends keyof Screens = keyof Screens> = {
    route: RouteProp<Screens, Route>
}

export type Screens = {
    Home: undefined,
    Calendar: undefined,
    Appointment: { appointment?: MonthlyAppointment }
    Settings: undefined,
}

export const Stack = createStackNavigator<Pick<Screens, 'Home' | 'Appointment'>>()
export const Tabs = createMaterialBottomTabNavigator<Pick<Screens, 'Calendar' | 'Settings'>>();

export const OAuthContext = createContext<[Session, (_: Session) => void]>([
    EMPTY_SESSION,
    () => {}
])

const Root = () => {
    const state = useState<Session>(EMPTY_SESSION)
    useEffect(() => {
        if(state[0] === EMPTY_SESSION) {
            oauthAuthorize().then(state[1])
        }
    }, [state[0]])

    return <OAuthContext.Provider value={state}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home"
                              component={HomeScreen} />
                <Stack.Screen name="Appointment"
                              component={AppointmentScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    </OAuthContext.Provider>
}

export const App: FC = () =>
    <SWRConfig value={{provider: () => new Map()}}>
        <PaperProvider>
            <Root />
        </PaperProvider>
    </SWRConfig>
