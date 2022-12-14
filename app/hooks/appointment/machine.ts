import {createMachine, guard, invoke, reduce, state, transition} from "robot3";
import {AppointmentContext} from "./context";
import {Participant} from "../../models/participant";

export type Input = {
    key: 'start' | 'end' | 'description',
    value: string
}

export type Invite = {
    participants: Participant[]
}

export const appointmentMachine = createMachine({
    sync: invoke(
        (ctx: AppointmentContext) => ctx.sync(),
        transition('done', 'view',
            guard((ctx: AppointmentContext) => ctx.isExists),
            reduce((_: AppointmentContext, {data}: {data: AppointmentContext}) => data)),
        transition('done', 'edit',
            guard((ctx: AppointmentContext) => !ctx.isExists && !ctx.isError),
            reduce((_: AppointmentContext, {data}: {data: AppointmentContext}) => data)),
        transition('done', 'error',
            guard((ctx: AppointmentContext) => ctx.isError),
            reduce((_: AppointmentContext, {data}: {data: AppointmentContext}) => data))
    ),
    view: state(
        transition('edit', 'edit',
            guard((ctx: AppointmentContext) => ctx.canEdit)),
        transition('reload', 'sync',
            reduce((ctx: AppointmentContext) => ctx.clear())),
        transition('accept', 'edit',
            guard((ctx: AppointmentContext) => ctx.canAccept),
            reduce((ctx: AppointmentContext) => ctx.accept())),
        transition('decline', 'edit',
            guard((ctx: AppointmentContext) => ctx.canDecline),
            reduce((ctx: AppointmentContext) => ctx.decline())),
    ),
    edit: state(
        transition('accept', 'edit',
            guard((ctx: AppointmentContext) => ctx.canAccept),
            reduce((ctx: AppointmentContext) => ctx.accept())),
        transition('decline', 'edit',
            guard((ctx: AppointmentContext) => ctx.canDecline),
            reduce((ctx: AppointmentContext) => ctx.decline())),
        transition('input', 'edit',
            reduce((ctx: AppointmentContext, {key, value}: Input) => ctx.edit(key, value))),
        transition('invite', 'edit',
            reduce((ctx: AppointmentContext, {participants}: Invite) => ctx.invite(participants))),
        transition('sync', 'sync',
            guard((ctx: AppointmentContext) => ctx.isEdited || ctx.isCreated)),
        transition('reset', 'edit',
            guard((ctx: AppointmentContext) => ctx.isEdited || ctx.isCreated),
            reduce((ctx: AppointmentContext) => ctx.reset())),
        transition('reload', 'sync',
            reduce((ctx: AppointmentContext) => ctx.clear())),
        transition('cancel', 'view',
            guard((ctx: AppointmentContext) => ctx.isEdited),
            reduce((ctx: AppointmentContext) => ctx.reset()))
    ),
    error: state(
        transition('reload', 'sync',
            reduce((ctx: AppointmentContext) => ctx.clear())),
    )
}, (ctx: AppointmentContext) => ctx)