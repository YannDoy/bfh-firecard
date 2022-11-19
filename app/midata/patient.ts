import {authFetch} from "./client";
import {Oauth} from "./oauth";

type PatientEmailSearchSet
    = { identifier: { system: string, value: string }[] }

type PatientCommand = {
    signal: AbortSignal|undefined,
    session: Oauth
}

export const getPatientEmail = ({signal, session}: PatientCommand)
    : Promise<string> => authFetch<PatientEmailSearchSet, never, string>({
        signal,
        session,
        method: "GET",
        path: `/Patient/${session.patientId}`,
        decode: (input: PatientEmailSearchSet) => {
            const found = input.identifier.find(id => id.system === "http://midata.coop/identifier/patient-login")
            if (found === undefined) throw new Error("invalid format")
            return found.value
        }
    })
