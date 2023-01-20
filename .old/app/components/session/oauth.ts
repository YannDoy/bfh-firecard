import config from "../../midata.json";
import {authorize, AuthorizeResult, logout, refresh} from "react-native-app-auth";

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

export class Session {
    constructor(readonly accessToken: string,
                readonly refreshToken: string,
                readonly expirationDate: Date,
                readonly userId: string) {
    }

    get isActive(): boolean {
        return this.accessToken !== ""
            && this.expirationDate.getTime() > Date.now()
    }

    async revoke(): Promise<null> {
        await logout()

        // @TODO revocation
        return null;
    }

    async refresh(): Promise<Session> {
        const authorization = this.isActive
            ? await authorize(OAUTH_CONFIG)
            : await refresh(OAUTH_CONFIG, {refreshToken: this.refreshToken})
        return new Session(
            authorization.accessToken,
            authorization.refreshToken ?? this.refreshToken,
            new Date(authorization.accessTokenExpirationDate),
            'tokenAdditionalParameters' in authorization
                ? `Patient/${authorization.tokenAdditionalParameters!.patient}`
                : this.userId
        )
    }
}




export const NONE_SESSION: Session = new Session(
    "",
    "",
    new Date(0),
    ""
)