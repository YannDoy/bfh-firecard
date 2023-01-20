import {FC, useCallback, useState} from "react";
import {WithAppNavs} from "./index";
import {SafeAreaView} from "react-native";
import {useSession} from "../components/session";
import {Button} from "react-native-paper";

export const Login: FC<WithAppNavs<'Home'>> = () => {
    const session = useSession()
    const [loading, setLoading] = useState(false)

    const login = useCallback(() => {
        setLoading(true)
        session.start()
    }, [])

    return <SafeAreaView>
        <Button loading={loading} onPress={login}>
            Login
        </Button>
    </SafeAreaView>
}