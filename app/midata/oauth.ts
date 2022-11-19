import {AuthConfiguration, authorize} from "react-native-app2-auth";
import apiConfig from "../api-config.json";

export type Oauth = {
    patientId: string,
    accessToken: string,
    refreshToken: string,
    expiration: Date
}

const authorizeConfig: AuthConfiguration = {
    issuer: `${apiConfig.baseUri}/fhir`,
    clientId: apiConfig.clientId,
    redirectUrl: apiConfig.redirectUrl,
    scopes: ['user/*.*'],
    serviceConfiguration: {
        authorizationEndpoint: `${apiConfig.baseUri}${apiConfig.authorizationEndpoint}`,
        tokenEndpoint: `${apiConfig.baseUri}${apiConfig.tokenEndpoint}`
    },
    additionalParameters: {},
    usePKCE: true,
    useNonce: true
}

export const oauth = async (): Promise<Oauth> => {
    const authorizeResult = await authorize(authorizeConfig)
    return {
        patientId: authorizeResult.tokenAdditionalParameters!.patient,
        accessToken: authorizeResult.accessToken,
        refreshToken: authorizeResult.refreshToken,
        expiration: new Date(Date.parse(authorizeResult.accessTokenExpirationDate))
    }
}