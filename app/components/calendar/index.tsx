import {FC} from "react";

export type CalendarProps = {
    selectedDate: Date,
    onSelectDate: (newDate: Date) => void,
}

export const Calendar: FC<CalendarProps> = ({selectedDate, onSelectDate}) => {
    return <></>
}