export type MidataType = {
    AppointmentSearchBundle: {
        entry?: ({resource: MidataType["Appointment"]})[]
    },
    Appointment: {
        readonly resourceType: "Appointment",
        readonly id?: string,
        meta?: { versionId: string },
        status: MidataType['AppointmentStatus'],
        description?: string,
        comment?: string,
        patientInstruction?: string,
        start?: string,
        end?: string,
        participant?: MidataType["Participant"][]
    },
    AppointmentStatus: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' |
        'cancelled' | 'noshow' | 'entered-in-error' | 'checked-in' | 'waitlist',
    Participant: {
        status: MidataType['ParticipantStatus'],
        actor?: {
            reference?: `/${MidataType['ParticipantType']}/${string}`,
            display?: string,
            identifier?: {
                system: 'http://midata.coop/identifier/patient-login' | string,
                value: string
            }
        }
    },
    ParticipantType: 'Patient' | 'Practitioner' | 'PractitionerRole' | 'RelatedPerson'
        | 'Device' | 'HealthcareService' | 'Location',
    ParticipantStatus: 'accepted' | 'declined' | 'tentative' | 'needs-action'
}