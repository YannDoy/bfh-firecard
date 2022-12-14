import {authorize, AuthorizeResult} from "react-native-app-auth";
import {http} from "../utils/http";
import {id} from "../utils/lenses";
import {Session} from "./session";
import config from "../midata.json";

const OAUTH_CONFIG = {
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

export const oauthAuthorize = async (): Promise<Session> =>
    authorize(OAUTH_CONFIG)
        .then((authorization: AuthorizeResult): Session => ({
            accessToken: authorization.accessToken,
            refreshToken: authorization.refreshToken,
            expiration: new Date(authorization.accessTokenExpirationDate),
            reference: `Patient/${authorization.tokenAdditionalParameters!.patient}`,
        }))


export const fetcher = <T, U=T>([oauth, path, map = id as any]: [Session, string, ((_: T) => U)]): Promise<U> =>
    http<T>(oauth.accessToken, "GET", path)
        .then(map)
