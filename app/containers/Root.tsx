import {FC} from "react";
import {useSession} from "../components/session";
import {Provider as PaperProvider} from "react-native-paper"
import {NavigationContainer} from "@react-navigation/native";
import {Stack} from "./index";
import {Login} from "./Login";
import {Home} from "./Home";
import {Appointment} from "./Appointment";

export const Root: FC = () => {
    const session = useSession()
    return <PaperProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home"
                              component={session.oauth === undefined ? Login : Home} />
                <Stack.Screen name="Appointment"
                              component={Appointment} />
            </Stack.Navigator>
        </NavigationContainer>
    </PaperProvider>
}

