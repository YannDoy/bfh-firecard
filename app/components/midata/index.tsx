import {FC, PropsWithChildren} from "react";
import {SWRConfig, SWRConfiguration} from "swr/_internal";
import {MidataProvider as InternalMidataProvider, useMidata as useInternalMidata} from "./_internal/hook";
import useSWR from "swr/immutable";
import {midataFetch} from "./_internal/fetch";
import {useSWRConfig} from "swr";
export type {MidataType} from "./_internal/types"

/**
 * @api Midata Provider Component
 * @param login
 * @param children
 * @constructor
 */
export const Midata: FC<PropsWithChildren> = ({children}) =>
    <SWRConfig value={{provider: () => new Map()}}>
        <InternalMidataProvider
            children={children} />
    </SWRConfig>

/**
 * @api
 * @return midata session revoke callback
 */
export function useMidataRevoke(): (() => void) {
    const midata = useInternalMidata()
    return midata.revoke
}

/**
 * @api
 * @return Midata session user reference
 */
export function useMidataUserReference(): string {
    const midata = useInternalMidata()
    return midata.session?.userReference!
}

/**
 * @api Get Midata Mutate (useful to invalidate cache)
 * @return SWR mutate
 */
export function useMidataMutate() {
    return useSWRConfig().mutate
}

/**
 * @api Use Midata Session context fetch client (HTTP)
 * @return http fetch client
 */
export function useMidataFetch():
    <T>(method: ("GET" | "POST" | "PUT" | "DELETE"), path: string, body?: T) => Promise<T | undefined> {
    const midata = useInternalMidata()
    return function<T>(method: 'GET'|'POST'|'PUT'|'DELETE', path: string, body?: T) {
        if (midata.session === undefined) {
            throw new Error("call midata fetch without valid session")
        } else {
            return midataFetch<T>(method, path, midata.session.accessToken, body)
        }
    }
}

/**
 * @api Use Midata Resource
 * @param path false to disable fetching
 * @param options
 * @return ReturnType<typeof useSWR<T>>
 */
export function useMidataResource<T>(path: string|false|null|undefined, options?: SWRConfiguration):
    ReturnType<typeof useSWR<T>> {
    const midata = useInternalMidata()
    return useSWR<T>(
        (midata.session !== undefined && path) ? path : null,
        () => midataFetch<T>("GET", path as string, midata.session!.accessToken)
            .then(result => result !== undefined ? result : Promise.reject()),
        options
    )
}
