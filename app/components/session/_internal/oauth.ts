import {AuthConfiguration, authorize, refresh, revoke} from "react-native-app-auth";
import config from "../../../midata.json";

export type OAuthSession = Readonly<{
    accessToken: string
    refreshToken: string
    validUntil: Date
    userReference: string
}>

const OAuthConfig: AuthConfiguration = {
    issuer: `${config.baseUri}/fhir`,
    clientId: config.clientId,
    redirectUrl: config.redirectUrl,
    scopes: ['user/*.*'],
    serviceConfiguration: {
        authorizationEndpoint: `${config.baseUri}${config.authorizationEndpoint}`,
        tokenEndpoint: `${config.baseUri}${config.tokenEndpoint}`
    },
    additionalParameters: {},
    usePKCE: true,
    useNonce: true
}

export async function oauth(): Promise<OAuthSession> {
    const result = await authorize(OAuthConfig)
    return {
        validUntil: new Date(result.accessTokenExpirationDate),
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        userReference: `Patient/${result.tokenAdditionalParameters!.patient}`
    }
}

export async function oauthRefresh(session: OAuthSession): Promise<OAuthSession> {
    const result = await refresh(OAuthConfig, {refreshToken: session.refreshToken})
    return {
        ...session,
        accessToken: result.accessToken,
        validUntil: new Date(result.accessTokenExpirationDate),
        refreshToken: result.refreshToken ?? session.refreshToken
    }
}

export async function oauthRevoke(session: OAuthSession): Promise<void> {
    await revoke(OAuthConfig, {tokenToRevoke: session.accessToken})
}
