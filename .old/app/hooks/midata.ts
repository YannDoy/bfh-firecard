import {useContext} from "react";
import {OAuthContext} from "../containers/App";
import {EMPTY_SESSION, Session} from "../models/session";

export function useMidataSession(): Session {
    return useContext(OAuthContext)[0]
}

export function useMidataLogin() {
    const setOAuth = useContext(OAuthContext)[1]
    return () => setOAuth(EMPTY_SESSION)
}