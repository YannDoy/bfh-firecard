/**
 * FHIR resource Appointment in JSON format
 */
export type Appointment = {
    resourceType: "Appointment",
    id?: string,
    meta?: { versionId: string, lastUpdated?: string },
    status?: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled',
    description?: string,
    start?: string,
    end?: string,
    participant?: ({
        status?: "accepted" | "declined" | "tentative" | "error",
        actor: {
            reference?: string,
            display?: string,
            identifier?: { system?: string, value?: string }
        }
    })[]
}
