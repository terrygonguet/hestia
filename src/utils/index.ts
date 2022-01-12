import type { Component } from "src/types"

export async function asyncMap<T, U>(
	array: T[],
	f: (el: T, i: number) => Promise<U>,
): Promise<U[]> {
	return Promise.all(array.map(f))
}

export async function getCustomComponent(url: string): Promise<Component> {
	const res = await fetch(url)
	const code = await res.text()
	const fn = new Function("module", code)
	const module = { exports: {} as any }

	fn(module)

	return module.exports
}
