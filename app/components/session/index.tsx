import {createContext, FC, PropsWithChildren, useContext} from "react";
import {Session, useInternalSession} from "./_internal/hook";

const SessionContext = createContext<Session>({
    start() {},
    stop() {}
})

export const useSession = () => useContext(SessionContext)

export const SessionProvider: FC<PropsWithChildren> = ({children}) => {
    const session = useInternalSession()
    return <SessionContext.Provider
        value={session}
        children={children} />
}