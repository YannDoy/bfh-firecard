export interface HK {0: unknown, 1: unknown}
export type Apply<F extends HK, A> = (F & {1: A})[0]
export interface Id extends HK {0: Right<this[1]>}
export interface Cons<A> extends HK {0: Left<A>}
export interface Functor<F extends HK, A> { map<B>(f: (_: A) => B): Apply<F, B> }
export type Lens<A, B> = <F extends HK>(f: (_: B) => Apply<F, B>) => (_: A) => Apply<F, A>

class Left<A> implements Functor<Cons<A>, A> {
    constructor(readonly value: A) {
    }
    map<B>(f: (_: A) => B): Apply<Cons<A>, B> {
        return this as any
    }
}

class Right<A> implements Functor<Id, A> {
    constructor(readonly value: A) {
    }
    map<B>(f: (_: A) => B): Right<B> {
        return new Right(f(this.value))
    }
}

export const view = <A, B>(lens: Lens<A, B>) => (sub: A): B => lens<Cons<B>>(x => new Left(x))(sub).value
export const over = <A, B>(lens: Lens<A, B>, f: (_: B) => B) => (sub: A): A => lens<Id>(x => new Right(f(x)))(sub).value