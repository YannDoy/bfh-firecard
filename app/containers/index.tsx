import {createStackNavigator} from "@react-navigation/stack";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import {RouteProp} from "@react-navigation/core/src/types";

export type AppNavs = {
    Home: undefined,
    Agenda: undefined,
    Appointment: undefined,
    Settings: undefined
}

export type WithAppNavs<Route extends keyof AppNavs, Params extends {} = {}> = Params
    & { route: RouteProp<AppNavs, Route> }

export const Stack = createStackNavigator<Omit<AppNavs, 'Agenda' | 'Settings'>>()
export const Tabs = createMaterialBottomTabNavigator<Pick<AppNavs, 'Agenda' | 'Settings'>>()

export {Root} from "./Root"