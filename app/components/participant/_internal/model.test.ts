import * as O from "optics-ts"
import {isEmail, statusL} from "./participant";

describe("isEmail predicate", () => {
    it.each`
        candidate                 | isValid
        ${'doydy1@bfh.ch'}        | ${true}
        ${'alice@firecard.test'}  | ${true}
        ${'bob@firecard.test'}    | ${true}
        ${''}                     | ${false}
        ${'    '}                 | ${false}
        ${'@bob'}                 | ${false}
        ${'@bob.ts'}              | ${false}
        ${'welcome@ sss'}         | ${false}
        ${'???@∂ƒf67frs5@643g.d'} | ${false}
    `
    ('$candidate should be $isValid for isEmail', ({candidate, isValid}) => {
        const act = isEmail(candidate)
        expect(act).toBe(isValid)
    })
})

describe("participant status lens.png", () => {
    const actor = {}
    const arrange = it.each`
        candidate                           | current        | change
        ${{actor: {}}}                      | ${'tentative'} | ${'accepted'}
        ${{status: "tentative", actor}}     | ${'tentative'} | ${'declined'}
        ${{status: "accepted", actor}}      | ${'accepted'}  | ${'declined'}
        ${{status: "declined", actor}}      | ${'declined'}  | ${'tentative'}
        ${{status: "error", actor}}         | ${'error'}     | ${'accepted'}
    `

    arrange("$candidate status should be $current", ({candidate, current}) => {
        const act = O.get(statusL)(candidate)
        expect(act).toStrictEqual(current)
    })

    arrange("$candidate status set to $change", ({candidate, change}) => {
        const act = O.set(statusL)(change)(candidate)
        expect(O.get(statusL)(act)).toStrictEqual(change)
    })
})