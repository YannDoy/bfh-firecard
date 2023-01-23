import {midataOAuth, midataOAuthRefresh, MidataSession} from "./oauth";
import {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from "react";
import {getGenericPassword, resetGenericPassword, setGenericPassword} from "react-native-keychain";

/**
 * @internal Midata Hook structure
 */
export type Midata = {
    session?: MidataSession,
    revoke(): void
}

const MidataHookContext = createContext<Midata>({
    session: undefined,
    revoke() {}
})

/**
 * @internal Use Midata Hook
 */
export function useMidata(): Midata {
    const hook = useContext(MidataHookContext)
    if (hook === undefined) throw new Error("cannot use useMidataHook without MidataHookProvider")
    return hook
}

/**
 * @constructor for make available Use Midata Hook on children component
 */
export const MidataProvider: FC<PropsWithChildren> = ({children}) => {
    const [session, setSession] = useState<MidataSession|undefined>( undefined)

    useEffect(() => {
        // If session not even start
        if (session === undefined) {
            let cancelled = false
            getGenericPassword() // attempt to refresh persisted session
                .then(persistedUserCredentials => !cancelled
                    && persistedUserCredentials !== false
                    && midataOAuthRefresh(JSON.parse(persistedUserCredentials.password))
                    || Promise.reject("Persisted user credentials is invalid"))
                .catch(() => midataOAuth()) // or initial session
                .then(session => !cancelled
                    && setSession(session))
            // cancel session start effect if component hook unmount (clean up)
            return () => { cancelled = true }
        } else {
            // Auto refresh when session expired
            let timeout = 0
            let cancelled = false
            // Persist session to keychain
            setGenericPassword("user", JSON.stringify(session))
                .then(r => {
                    if (cancelled) return // if cancelled do nothing
                    console.log("persisted password", r)
                    // Time to live for session
                    const ttl = Math.max(((+session!.validUntil) - (+new Date)), 0)
                    timeout = setTimeout(() => {
                        if (cancelled) return // if cancelled do nothing
                        midataOAuthRefresh(session!)
                            .then(refreshedSession => !cancelled &&
                                setSession(refreshedSession))
                    }, ttl)
                })
                .catch(error => {
                    console.log("persist keychain", error)
                })

            // cancel session refresh timer if component hook unmount (clean up)
            return () => {
                clearTimeout(timeout);
                cancelled = true
            }
        }
    }, [session])

    const revoke = () => {
        resetGenericPassword()
            .then(() => setSession(undefined))
            .catch(error => console.error("revoke failed", error))
    }

    return <MidataHookContext.Provider
        value={{session, revoke}}
        children={children}/>
}