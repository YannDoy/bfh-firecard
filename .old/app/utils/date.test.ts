import {test, expect, jest} from "@jest/globals";
import {dateFormat, dateTimeFormat} from "./date";

test("date format test", () => {
    const arrange: [Date, string][] = [
        [new Date(2020, 0, 1), "2020-01-01"],
        [new Date(2022, 1, 28), "2022-02-28"],
        [new Date(2020, 1, 29), "2020-02-29"],
        [new Date(2022, 11, 31), "2022-12-31"]
    ]
    const acts = arrange.map(([date, expect]) => dateFormat(date) === expect)
    expect(acts.every(act => act)).toBe(true)
})

test("date time format", () => {
    const arrange: string[] = [
        "2022-12-27T23:00:00.000+00:00",
        "2022-12-12T02:05:31.000+01:00",
    ]
    const acts = arrange.every(date =>
        dateTimeFormat(new Date(date)) === dateTimeFormat(new Date(dateTimeFormat(new Date(date)))))
    expect(acts).toBe(true)
})