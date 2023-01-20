import {FC} from "react";
import {WithAppNavs} from "./index";
import {SafeAreaView} from "react-native";
import {useSession} from "../components/session";
import {Button} from "react-native-paper";

export const Settings: FC<WithAppNavs<"Settings">> = () => {
    const session = useSession()

    return <SafeAreaView>
        <Button onPress={() => session.stop()}>Logout</Button>
    </SafeAreaView>
}