import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Oauth, oauth} from "../midata/oauth";
import {getPatientEmail} from "../midata/patient";

export type Session = Oauth & {patientEmail: string}

export type Login = {
    isLoading: boolean,
    isError: boolean,
    session: Session|null,
    authorize: () => void,
    revoke: () => void
}

export function useLogin(): Login {
    const queryClient = useQueryClient()

    const session = useQuery({
        enabled: false,
        staleTime: 30 * 60 * 1000,
        queryKey: ["oauth"],
        queryFn: () => oauth(),
    })

    const patientEmail = useQuery({
        enabled: session.isFetched && !session.isError,
        staleTime: Infinity,
        queryKey: ["patient-email"],
        queryFn: (context) => getPatientEmail({
            signal: context.signal,
            session: session.data!,
        })
    })

    return {
        isLoading: session.isFetching || patientEmail.isFetching,
        isError: session.isError || patientEmail.isError,
        session: session.isFetched && !session.isStale && !session.isError &&
                 patientEmail.isFetched && !patientEmail.isStale && !patientEmail.isError
            ? {...session.data!, patientEmail: patientEmail.data!}
            : null,
        authorize() {
            session.refetch()
        },
        revoke() {
            queryClient.invalidateQueries(["oauth"])
            queryClient.invalidateQueries(["patient-email"])
        }
    }
}

export const useActiveSession = (): Session => {
    const login = useLogin()
    if (login.isError || login.session === null) throw new Error("not in active session")
    return login.session!
}