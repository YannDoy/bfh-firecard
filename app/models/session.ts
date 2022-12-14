export type Session = {
    accessToken: string,
    refreshToken: string,
    expiration: Date,
    reference: string
}

export const EMPTY_SESSION: Session = {
    accessToken: "",
    refreshToken: "",
    expiration: new Date(0),
    reference: "",
}