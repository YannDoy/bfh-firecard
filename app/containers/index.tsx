import {createStackNavigator} from "@react-navigation/stack";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import {RouteProp} from "@react-navigation/core/src/types";
import {NavigationProp} from "@react-navigation/native";

export type AppNavs = {
    Home: undefined,
    Agenda: undefined,
    Appointment: { id: string },
    Settings: undefined
}

export type WithAppNavs<Route extends keyof AppNavs, Params extends {} = {}> = Params
    & { route: RouteProp<AppNavs, Route> }
    & { navigation: NavigationProp<AppNavs, Route> }

export const Stack = createStackNavigator<AppNavs>()
export const Tabs = createMaterialBottomTabNavigator<AppNavs>()