import config from "./midata.json"

/**
 * @internal Midata Api HTTP Fetch
 *
 * @param method http verb of rest api endpoint call
 * @param path of endpoint
 * @param accessToken bearer Token
 * @param body of resource past (for POST and PUT)
 */
export async function midataFetch<T>(method: 'GET'|'POST'|'PUT'|'DELETE',
                                     path: string,
                                     accessToken: string,
                                     body?: T): Promise<T|undefined> {
    console.log("before fetch", method, `${config.baseUri}/fhir${path}`, body)
    const response = await fetch(
        `${config.baseUri}/fhir${path}`,
        {
            method,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: config.mimeType,
                'Content-Type': body !== undefined ? config.mimeType : undefined
            } as any
        }
    );
    console.log("after fetch", response.status)
    if (!response.ok) {
        throw response.status
    }
    if (response.status !== 204) {
        return await response.json() as T
    }
}