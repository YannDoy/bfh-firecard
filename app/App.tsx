import {FC} from "react";
import {SessionProvider} from "./components/session";
import {Root} from "./containers";

export const App: FC = () => <SessionProvider>
    <Root />
</SessionProvider>
