import {Appointment} from "../../models/appointment";
import {FC} from "react";

/**
 * Responsible for managing the preview / modification of an appointments
 */
export const AppointmentForm: FC<AppointmentFormProps> = ({isLoading, data, onPersist}) => {
    return <></>
}

export type AppointmentFormProps = {
    /** Block edition of data and display activity indicator (Skeleton Screen Loading) */
    isLoading: boolean

    /** Initial Appointment data to preview and edit */
    data: Appointment,

    /** Callback function to persisted edited model (only called when data is real changed) */
    onPersist: (edited: Appointment) => void
}