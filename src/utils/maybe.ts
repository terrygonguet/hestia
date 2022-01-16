export type Maybe<T> = T | undefined

export const None = undefined

export function Some<T>(value: T): Maybe<T> {
	return value
}

export function isSome<T>(maybe: Maybe<T>): maybe is T {
	return maybe !== undefined
}

export function isNone<T>(maybe: Maybe<T>): maybe is undefined {
	return maybe === undefined
}

export function map<T, U>(maybe: Maybe<T>, f: (value: T) => U): Maybe<U> {
	return maybe && f(maybe)
}

export function flatMap<T, U>(
	maybe: Maybe<T>,
	f: (value: T) => Maybe<U>,
): Maybe<U> {
	return maybe && f(maybe)
}
