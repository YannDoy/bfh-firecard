import {oauth, oauthRefresh, OAuthSession} from "./oauth";
import {useEffect, useState} from "react";
import {getGenericPassword, resetGenericPassword, setGenericPassword} from "react-native-keychain";

export type Session = Readonly<{
    oauth?: OAuthSession,
    error?: any,
    start(): void,
    stop(): void,
}>

export function useInternalSession(): Session {
    const [session, setSession] = useState({
        start() {
            if (this.oauth !== undefined) return
            oauth()
                .then(oauth => {
                    setSession({...session, error: undefined, oauth})
                    return oauth
                })
                .then(({accessToken, refreshToken, validUntil, userReference}) =>
                    setGenericPassword("user", JSON.stringify({
                        accessToken,
                        refreshToken,
                        userReference,
                        expire: validUntil.toISOString(),
                    })))
                .catch(error => setSession({...session, error}))
        },
        stop() {
            if (this.oauth === undefined) return
            resetGenericPassword()
                .finally(() => setSession({...session, error: undefined, oauth: undefined}))
        }
    } as Session)

    useEffect(() => {
        if (session.oauth === undefined) {
            getGenericPassword()
                .then(credentials => credentials ? JSON.parse(credentials.password) : Promise.reject())
                .then(({accessToken, refreshToken, userReference, expire}) => setSession({
                    ...session,
                    oauth: {
                        accessToken,
                        refreshToken,
                        validUntil: new Date(expire),
                        userReference
                    }
                }))
                .catch(error => setSession({...session, error}))
        }

        if (session.oauth !== undefined && session.oauth.validUntil.getTime() > Date.now()) {
            const timeout = setTimeout(() => {
                oauthRefresh(session.oauth!)
                    .then(oauth => setSession({...session, error: undefined, oauth}))
                    .catch(error => setSession({...session, error}))
            }, (session.oauth!.validUntil.getTime() - Date.now()) * 1000)
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [session])

    return session
}