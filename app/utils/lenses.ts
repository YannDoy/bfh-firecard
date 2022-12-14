export type Case = keyof Either<any, any>
export type Kind<C extends Case, A, B> = Either<A, B>[C]
export interface Either<A, B> { left: A, right: B }

export interface Functor<C extends Case, A, B> {
    value: Kind<C, A, B>
    <B2>(f: (_: B) => B2): Functor<C, A, B2>
}

export const left = <A>(value: A): Functor<"left", A, never> => {
    const fMap: any = <B2>(f: (_: never) => B2): Functor<"left", A, never> => fMap
    fMap.value = value
    return fMap
}

export const right = <B>(value: B): Functor<"right", never, B> => {
    const fMap: any = <B2>(f: (_: B) => B2): Functor<"right", never, B2> => right(f(value))
    fMap.value = value
    return fMap
}

export const id = <A>(x: A): A => x
export const compose = <A, B, C>(f: (_: B) => C, g: (_: A) => B) => (x: A): C => f(g(x))
export const const_ = <A>(x: A) => (): A => x

export type Option<T> = Some<T>|None

export type Some<T> = Functor<"right", never, T>
export const some: <T>(x: T) => Some<T> = right

export type None = Functor<"left", undefined, never>
export const none: None = left(undefined)

export type Lens<S, A> = ReturnType<typeof lens<S, A>>
export const lens = <S, A>(get: (_: S) => A, set: (_: S) => (_: A) => S = const_) =>
    <C extends Case>(f: (_: A) => Functor<C, A, A>) => (s: S): Functor<C, A, S> =>
        f(get(s))(set(s))

export const view = <S, A>(L: Lens<S, A>) => (s: S) => L(left)(s).value
export const over = <S, A>(L: Lens<S, A>, f: (_: A) => A) => (s: S) => L(compose(right, f))(s).value
export const modify = <S, A>(L: Lens<S, A>, x: A) => over(L, const_(x))

export const constL = <A>(x: A) => lens<unknown, A>(const_(x))

export const propL = <T, K extends keyof T, U extends T[K]=T[K]>(k: K, alt?: U) =>
    lens<T, U>(
    p => (p[k] ?? alt) as U,
    p => v => p[k] !== v ? {...p, [k]: v} : p)

export const indexL = <T, U extends T>(i: number, alt: U) => lens<T[], NonNullable<T>|U>(
    p => p[i] ?? alt,
    p => v => { if(p[i] === v && v === undefined) return p; const c = [...p]; c[i] = v as any; return c })

export const compL: <A, B, C>(x: Lens<A, B>, y: Lens<B, C>) => Lens<A, C> = compose as any
