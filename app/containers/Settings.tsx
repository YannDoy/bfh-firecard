import {FC} from "react";
import {WithAppNavs} from "./index";
import {SafeAreaView} from "react-native";
import {useMidataRevoke} from "../components/midata";
import {Button} from "react-native-paper";

export const Settings: FC<WithAppNavs<"Settings">> = () => {
    const revoke = useMidataRevoke()
    return <SafeAreaView>
        <Button onPress={revoke}>Logout</Button>
    </SafeAreaView>
}