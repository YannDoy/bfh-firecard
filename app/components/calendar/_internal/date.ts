/**
 * Format Date
 */
export function formatDate(date: Date): string {
    return `${String(date.getFullYear()).padStart(4, '0')}`
         + `-${String(date.getMonth() + 1).padStart(2, '0')}`
         + `-${String(date.getDate()).padStart(2, '0')}`
         + `T${String(date.getHours()).padStart(2, '0')}`
         + `:${String(date.getMinutes()).padStart(2, '0')}`
         + `:${String(date.getSeconds()).padStart(2, '0')}`
         + `+${date.getTimezoneOffset() === 60 ? '01:00' : '02:00'}`
}

/**
 * Mutator on copy
 */
export function withYearMonthDay(date: Date, year: number, month: number, day: number): Date {
    const copy = new Date(date)
    copy.setFullYear(year, month - 1, day)
    return copy
}