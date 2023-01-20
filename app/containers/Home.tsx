import {FC} from "react";
import {Tabs, WithAppNavs} from "./index";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Agenda} from "./Agenda";
import {Settings} from "./Settings";

export const Home: FC<WithAppNavs<"Home">> = () => <Tabs.Navigator initialRouteName="Agenda">
    <Tabs.Screen name="Agenda"
                 options={{tabBarIcon: ({color}) =>
                         <Icon name="calendar-month" color={color} size={26} />}}
                 component={Agenda} />
    <Tabs.Screen name="Settings"
                 options={{tabBarIcon: ({color}) =>
                         <Icon name="cog" color={color} size={26} />}}
                 component={Settings} />
</Tabs.Navigator>