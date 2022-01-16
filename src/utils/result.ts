type Left<T> = {
	_kind: "Left"
	value: T
}

type Right<T> = {
	_kind: "Right"
	value: T
}

export type Result<L, R> = Left<L> | Right<R>

export function Left<L, R>(value: L): Result<L, R> {
	return { _kind: "Left", value }
}

export function Right<L, R>(value: R): Result<L, R> {
	return { _kind: "Right", value }
}

export function isLeft<L, R>(result: Result<L, R>): result is Left<L> {
	return result._kind == "Left"
}

export function isRight<L, R>(result: Result<L, R>): result is Right<R> {
	return result._kind == "Right"
}

export function map<L, R1, R2>(
	result: Result<L, R1>,
	f: (value: R1) => R2,
): Result<L, R2> {
	if (result._kind == "Left") return result
	else return Right(f(result.value))
}

export function flatMap<L, R1, R2>(
	result: Result<L, R1>,
	f: (value: R1) => Result<L, R2>,
): Result<L, R2> {
	if (result._kind == "Left") return result
	else return f(result.value)
}
