const pad = (num: number, len: number) => String(num).padStart(len, '0')

export const dateFormat = (d: Date) =>
    `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1, 2)}-${pad(d.getDate(), 2)}`
export const dateTimeFormat = (d: Date) =>
    `${dateFormat(d)}T${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}:${pad(d.getSeconds(), 2)}` +
    `.000${d.getTimezoneOffset() < 0 ? "+" : "-"}${pad(Math.abs(Math.floor(d.getTimezoneOffset() / 60)), 2)}:${pad(d.getTimezoneOffset() % 60, 2)}`

export const setDate = (d: Date, date: number) => {
    const copy = new Date(d)
    copy.setDate(date)
    return copy
}

export const setYearMonthDate = (d: Date, year: number, month: number, date: number) => {
    const copy = new Date(d)
    copy.setFullYear(year, month - 1, date)
    return copy
}

export const addMonth = (d: Date, month: number) => {
    const copy = new Date(d)
    copy.setMonth(copy.getMonth() + month)
    return copy
}

export const addMinutes = (d: Date, minutes: number) => {
    const copy = new Date(d)
    copy.setMinutes(copy.getMinutes() + minutes)
    return copy
}