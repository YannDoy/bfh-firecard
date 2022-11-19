import midata from "../api-config.json"
import {Oauth} from "./oauth";

export type AuthFetch<T, I, O> = {
    signal: AbortSignal|undefined,
    session: Oauth,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    data?: I|undefined,
    encode?: (input: I) => T,
    decode?: (input: T) => O
}

export const authFetch = async<T, I=never, O=T>({ signal, session, method, path, data, encode, decode }: AuthFetch<T, I, O>)
    : Promise<O> => {

    const request = new Request(`${midata.baseUri}/fhir${path}`, {
        method,
        signal,
        body: data !== undefined ? JSON.stringify(encode ? encode(data) : data) : undefined,
        headers: {
            "Authorization": `Bearer ${session.accessToken}`,
            "Accept": "application/fhir+json; fhirVersion=4.0",
            "Content-Type": "application/fhir+json; fhirVersion=4.0"
        }
    })

    const response = await fetch(request)

    if (response.ok || response.headers.get("Content-Type") === "application/fhir+json; fhirVersion=4.0") {
        const result = await response.json()
        return decode ? decode(result) : result
    }

    throw response
}