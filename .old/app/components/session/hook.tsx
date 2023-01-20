import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {oauth} from "./oauth";
import {NONE_SESSION, Session} from "./oauth";

export const SessionContext = createContext<Session>(NONE_SESSION)

export function useSession(): Session {
    return useContext(SessionContext)
}

export function SessionManager({children}: PropsWithChildren) {
    const [error, setError] = useState<any>()
    const [session, setSession] = useState<Session|null>(null)

    useEffect(() => {
        const abortCtrl = new AbortController()
        if (session === null) {
            oauth(abortCtrl.signal)
                .then(newSession => setSession(newSession))
                .catch(reason => setError(reason))
        } else {
            session.refresh(abortCtrl.signal)
                .then(newSession => setSession(newSession))
                .catch(reason => setError(reason))
        }
        return () => abortCtrl.abort()
    }, [session])

    if (session !== null) {
        return <SessionContext.Provider
            value={session}
            children={children} />
    }

    return null
}