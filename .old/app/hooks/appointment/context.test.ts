import {aliceReference, mockAppointment} from "../../models/appointment/mock";
import {AppointmentContext} from "./context";

import {jest, test, expect} from "@jest/globals";
import {EMPTY_SESSION} from "../../models/session";

let ctx: AppointmentContext

beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: jest.fn(() => Promise.resolve(mockAppointment))
    } as any))

    ctx = AppointmentContext.of(
        {...EMPTY_SESSION, reference: aliceReference},
        () => {},
        {id: mockAppointment.id}
    )
})

test("simple edit", async () => {
    expect(ctx.data).toBe(undefined)
    expect(ctx.isExists).toBe(true)
    expect(ctx.isEdited).toBe(false)

    const ctx2 = await ctx.sync()

    expect(ctx2.data).toBe(mockAppointment)
    expect(ctx2.draft).toBe(mockAppointment)
})

test("participant split list", async () => {
    const ctx2 = await ctx.sync()
    expect(ctx2.participants).toBe("Bob Doe; Alice Doe")
    const ctx3 = ctx2.invite("Bob Doe; Alice Doe; ")
    expect(ctx2.participants).toBe("")
})