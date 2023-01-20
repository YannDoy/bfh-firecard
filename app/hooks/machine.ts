export type Workflow<P extends 'start'|string=never, T extends {type: string}=never, C=never> = {
    [t in T["type"]]: {
        from: P[],
        to: P[],
        reduce?: (context: C, event: (T & {type: t})) => C,
        effect?: (event: (T & {type: T}), process: Process<Workflow<P, T, C>>) => void
    }
}

export type Process<W extends Workflow<never, never, never>> = {

}