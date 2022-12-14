import {test, expect, jest} from "@jest/globals";
import {compL, id, modify, over, propL, view} from "./lenses";

test("propL", () => {

    type Test = {a: string}
    const t: Test = {a: "welcome"}
    const l = propL<Test, "a">("a")

    expect(view(l)(t)).toBe(t.a)
    expect(modify(l, t.a)(t)).toBe(t)
    expect(modify(l, "other")).not.toBe(t)
    expect(over(l, id)(t)).toBe(t)
})

test("compL", () => {
    type Test = {a: {b: string}}
    const t: Test = {a: {b: "welcome"}}
    const l = compL(propL<Test, "a">("a"), propL("b"))

    expect(view(l)(t)).toBe(t.a.b)
    expect(modify(l, t.a.b)(t)).toBe(t)
    expect(modify(l, "other")).not.toBe(t)
    expect(over(l, id)(t)).toBe(t)
})