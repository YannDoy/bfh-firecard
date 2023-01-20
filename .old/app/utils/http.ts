import config from "../midata.json";

export const http = async <T, U = T>(accessToken: string, method: string, path: string, body?: T): Promise<U> => {
    const request = new Request(`${config.baseUri}/fhir${path}`, {
        method,
        body: body != undefined ? JSON.stringify(body) : undefined,
        headers: {
            "Accept": config.mimeType,
            "Content-Type": config.mimeType,
            "Authorization": `Bearer ${accessToken}`
        }
    })
    const response = await fetch(request)
    if (!response.ok) throw response
    return await response.json()
}