import {Appointment, AppointmentLenses, makeLenses, newAppointment} from "../../models/appointment";
import {modify, view} from "../../utils/lenses";
import {MonthlyAppointment, monthlyAppointmentUrl} from "../../models/appointment/monthly";
import {http} from "../../utils/http";
import {Session} from "../../models/session";
import {Participant} from "../../models/participant";

export type InternalData = {
    readonly accessToken: string,
    readonly mutate: (_: string) => void,
    readonly lenses: AppointmentLenses,
    readonly draft: Appointment,
    readonly data?: Appointment,
    readonly error?: any,
    readonly conflict?: Appointment
}


export class AppointmentContext {
    static of(oauth: Session, mutate: (_: string) => void, props: MonthlyAppointment) {
        const lenses = makeLenses(oauth.reference)
        return new AppointmentContext({
            accessToken: oauth.accessToken,
            mutate, lenses,
            draft: newAppointment(oauth.reference, props),
        })
    }

    private constructor(private readonly internal: InternalData) {
    }

    get draft() {
        return this.internal.draft
    }

    get data() {
        return this.internal.data
    }

    get status() {
        return view(this.internal.lenses.status)(this.draft)
    }

    get selfParticipantStatus() {
        return view(this.internal.lenses.selfParticipantStatus)(this.draft)
    }

    get description() {
        return this.draft.description ?? ""
    }

    get start() {
        return this.draft.start ?? ""
    }

    get end() {
        return this.draft.end ?? ""
    }

    get participants() {
        return view(this.internal.lenses.participants)(this.draft)
            .join("; ")
    }

    get isCreated() {
        return this.draft !== this.data
            && this.data === undefined
    }

    get isExists() {
        return this.draft.id !== undefined
    }

    get isEdited() {
        return this.draft !== this.data
            && this.data !== undefined
    }

    get isError() {
        return this.internal.error !== undefined
    }

    get canEdit() {
        return !['fulfilled', 'cancelled'].includes(this.status)
    }

    get canAccept() {
        return ['proposed', 'pending'].includes(this.status)
            && this.selfParticipantStatus !== 'accepted'
    }

    get canDecline() {
        return this.canEdit
            && this.selfParticipantStatus !== 'declined'
    }

    sync(): Promise<AppointmentContext> {
        // Http request
        const promise: Promise<Appointment> = (
            (this.isCreated && this.isExists &&
                http(this.internal.accessToken, "GET", `/Appointment/${this.draft.id}`)) ||
            (this.isEdited && this.isExists &&
                http(this.internal.accessToken, "PUT", `/Appointment/${this.draft.id}`, this.draft)) ||
            (this.isEdited && !this.isExists &&
                http(this.internal.accessToken, "POST", `/Appointment`, this.draft)) ||
            Promise.resolve(this.data ?? this.draft))

        // When promise solved
        return promise.then(result => {
            // Invalidate cache for month
            ([this.start, this.end, result.start, result.end] as (string|undefined)[])
                .map((iso: string|undefined) => !!iso ? monthlyAppointmentUrl(new Date(iso)) : undefined)
                .filter(i => i !== undefined)
                .forEach(url => this.internal.mutate(url as string))

            // Map synced appointment context
            return new AppointmentContext({
                ...this.internal,
                draft: result,
                data: result
            })
        }).catch(error => Promise.resolve(new AppointmentContext({
            ...this.internal,
            error
        })))
    }

    edit(key: 'start' | 'end' | 'description', value: string): AppointmentContext {
        return new AppointmentContext({
            ...this.internal,
            draft: modify(this.internal.lenses[key], value)(this.draft)
        })
    }

    invite(participants: Participant[]) {
        console.log("invite", participants)
        return new AppointmentContext({
            ...this.internal,
            draft: modify(this.internal.lenses.participants, participants)(this.draft)
        })
    }

    accept() {
        if (!this.canAccept) {
            return this
        }
        return new AppointmentContext({
            ...this.internal,
            draft: modify(this.internal.lenses.selfParticipantStatus, "accepted")(this.draft)
        })
    }

    decline() {
        if (!this.canDecline) {
            return this
        }
        return new AppointmentContext({
            ...this.internal,
            draft: modify(this.internal.lenses.selfParticipantStatus, "declined")(this.draft)
        })
    }

    reset(): AppointmentContext {
        if (this.isEdited) {
            return new AppointmentContext({
                ...this.internal,
                draft: {...this.draft, ...this.data}
            });
        }
        return this
    }

    clear(): AppointmentContext {
        return new AppointmentContext({
            ...this.internal,
            data: undefined,
            error: undefined
        })
    }
}