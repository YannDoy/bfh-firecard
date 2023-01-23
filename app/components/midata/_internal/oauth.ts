import {AuthConfiguration, authorize, refresh} from "react-native-app-auth";
import config from "./midata.json";

export type MidataSession = Readonly<{
    accessToken: string   // oauth access token
    refreshToken: string  // oauth refresh token
    validUntil: Date      // expiration date of session
    userReference: string // midata id
}>

const MidataOAuthConfig: AuthConfiguration = {
    issuer: `${config.baseUri}/fhir`,
    clientId: config.clientId,
    redirectUrl: config.redirectUrl,
    scopes: ['user/*.*'],
    serviceConfiguration: {
        authorizationEndpoint: `${config.baseUri}${config.authorizationEndpoint}`,
        tokenEndpoint: `${config.baseUri}${config.tokenEndpoint}`
        // NO revocation now @TODO
    },
    additionalParameters: {},
    usePKCE: true,
    useNonce: true
}

/**
 * Initiate oauth 2.1 PKCE Flow to acquire OAuth Session
 */
export async function midataOAuth(): Promise<MidataSession> {
    const result = await authorize(MidataOAuthConfig)
    return {
        validUntil: new Date(result.accessTokenExpirationDate),
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        userReference: `Patient/${result.tokenAdditionalParameters!.patient}`
    }
}

/**
 * Attempt to refresh session
 * @param session outdated session
 * @return refreshed session
 */
export async function midataOAuthRefresh(session: MidataSession): Promise<MidataSession> {
    const result = await refresh(MidataOAuthConfig, {refreshToken: session.refreshToken})
    return {
        ...session,
        accessToken: result.accessToken,
        validUntil: new Date(result.accessTokenExpirationDate),
        refreshToken: result.refreshToken ?? session.refreshToken
    }
}