export async function asyncMap<T, U>(
	array: T[],
	f: (el: T, i: number) => Promise<U>,
): Promise<U[]> {
	return Promise.all(array.map(f))
}
