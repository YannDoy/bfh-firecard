import {formatDate, withYearMonthDay} from "./date";

describe("withYearMonthDay", () => {
    it.each`
        from                     | year    | month | day   | expected
        ${'2022-01-01T10:00:00'} | ${2022} | ${2}  | ${2}  | ${'2022-02-02T10:00:00'}
        ${'2022-01-01T10:00:00'} | ${2022} | ${3}  | ${2}  | ${'2022-03-02T10:00:00'}
        ${'2022-01-01T10:00:00'} | ${2022} | ${3}  | ${3}  | ${'2022-03-03T10:00:00'}
        ${'2022-01-01T11:34:00'} | ${2022} | ${3}  | ${4}  | ${'2022-03-04T11:34:00'}
    `
    ('withYearMonthDay($from, $year, $month, $day) should be $expected',
        ({from, year, month, day, expected}) => {
        const given = new Date(`${from}+01:00`)
        const act = withYearMonthDay(given, year, month, day)
        expect(formatDate(act)).toBe(formatDate(new Date(expected)))
    })
})