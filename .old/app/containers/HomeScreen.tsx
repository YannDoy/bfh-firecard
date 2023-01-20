import {FC} from "react";
import {CalendarScreen} from "./calendar/CalendarScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {SettingsScreen} from "./settings/SettingsScreen";
import {ScreenProp, Tabs} from "./App";

export const HomeScreen: FC<ScreenProp<"Home">> = () => {
    return <Tabs.Navigator initialRouteName="Calendar">
        <Tabs.Screen name="Calendar"
                     component={CalendarScreen}
                     options={{
                         tabBarIcon: ({color}) =>
                             <Icon name="calendar-month" color={color} size={26} />
                     }}/>
        <Tabs.Screen name="Settings"
                     component={SettingsScreen}
                     options={{
                         tabBarIcon: ({color}) =>
                             <Icon name="cog" color={color} size={26} />
                     }}/>
    </Tabs.Navigator>
}