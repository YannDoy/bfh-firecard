import {FC} from "react";
import {Stack} from "./containers";
import {Midata} from "./components/midata";
import {NavigationContainer} from "@react-navigation/native";
import {Home} from "./containers/Home";
import {Appointment} from "./containers/Appointment";
import {Provider as PaperProvider} from "react-native-paper";

export const App: FC = () => <PaperProvider>
    <Midata>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home"
                              component={Home} />
                <Stack.Screen name="Appointment"
                              component={Appointment} />
            </Stack.Navigator>
        </NavigationContainer>
    </Midata>
</PaperProvider>
