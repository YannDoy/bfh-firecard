interface HK {0: unknown; 1: unknown}
interface HK2 extends HK {2: unknown}
interface HK3 extends HK2 {3: unknown}

type Apply<T extends HK, A> = (T & {1: A})[0]
type Apply2<T extends HK2, A, B> = (T & {1: A; 2: B})[0]
type Apply3<T extends HK2, A, B, C> = (T & {1: A; 2: B; 3: C})[0]

interface Id extends HK {0: this[1]}
interface Compose<F extends >
interface HK2to1<T extends HK2, A> extends HK {0: Apply2<T, A, this[1]>}
interface HK3to1<T extends HK3, A, B> extends HK {0: Apply3<T, A, B, this[1]>}
interface HK3to2<T extends HK3, A> extends HK2 {0: Apply3<T, A, this[1], this[2]>}



type Lens<S, A> = (_: S) => [A, (_: A) => S]

const lens = <S, A>(get: (_: S) => A, set: (_: S) => (_: A) => S): Lens<S, A> => (s: S) =>
    [get(s), set(s)]


class Option<A=unknown, B=unknown> {
}





type Func<A, B> = (_: A) => B
type Change<A> = Func<A, A>

const id = <A>(x: A): A => x
const compose = <A, B, C>(f: Func<B, C>, g: Func<A, B>): Func<A, C> => {
    if (f === id) return g as any
    if (g === id) return f as any
    return (x: A) => f(g(x))
}

export class Optic<A, B> {
    constructor(readonly view: Func<A, B>,
                readonly over: Func<Change<B>, Change<A>>) {
    }

    then<C>(optic: Optic<B, C>): Optic<A, C> {
        return new Optic(
            compose(optic.view, this.view),
            compose(this.over, optic.over)
        )
    }

    set(value: B): Change<A> {
        return this.over(() => value)
    }
}

export const optic = <A>(): Optic<A, A> => new Optic(id, id)
export const prop = <A, B extends keyof A>(prop: B) => new Optic<A, A[B]>(
    subject => subject[prop],
    change => subject => ({...subject, [prop]: change(subject[prop])}))
export const at = <A>(index: number) => new Optic<A[], A|undefined>(
    subject => subject[index],
    change => subject => Object.assign([], subject, {[index]: change(subject[index])}))
export const guard = <A, B extends A>(f: (_: A) => _ is B) => new Optic<A, B|undefined>(
    subject => f(subject) ? subject : undefined,
    change => subject => f(subject) ? change(subject) ?? subject : subject
)

