export type MidataTypes = {
    AppointmentStatus: ["proposed","pending","booked","arrived","fulfilled","cancelled","noshow","enterer-in-error","checked-in","waitlist"][number]
    ParticipantStatus: ["accepted","declined","tentative","needs-action"][number],
    Participant: {
        status: MidataTypes['ParticipantStatus'],
        actor?: {
            reference?: string,
            display?: string,
            identifier?: { system?: string, value?: string }
        }
    },
    NewAppointment: {
        readonly resourceType: "Appointment",
        status: MidataTypes['AppointmentStatus'],
        start?: string,
        end?: string,
        description?: string,
        comment?: string,
        patientInstruction?: string,
        participant: MidataTypes['Participant'][],
    },
    Appointment: MidataTypes['NewAppointment'] & {
        readonly id?: string
        readonly meta?: {readonly versionId?: string}
    }
}