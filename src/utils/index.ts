import type { Component } from "$/types"
import type { Maybe } from "$/utils/maybe"

export async function asyncMap<T, U>(
	array: T[],
	f: (el: T, i: number) => Promise<U>,
): Promise<U[]> {
	return Promise.all(array.map(f))
}

export async function getCustomComponent(url: string): Promise<Component> {
	if (!url) throw new Error("Missing URL")
	new URL(url) // throws if invalid URL is passed
	const res = await fetch(url)
	const code = await res.text()
	const fn = new Function("module", code)
	const module = { exports: {} as any }

	fn(module)

	return module.exports
}

// return array of [r,g,b,a] from any valid color. if failed returns undefined
// from https://gist.github.com/oriadam/396a4beaaad465ca921618f2f2444d49
export function colorValues(
	color: string,
): Maybe<[number, number, number, number]> {
	if (!color) return
	if (color.toLowerCase() === "transparent") return [0, 0, 0, 0]
	if (color[0] === "#") {
		if (color.length < 7) {
			// convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
			color =
				"#" +
				color[1] +
				color[1] +
				color[2] +
				color[2] +
				color[3] +
				color[3] +
				(color.length > 4 ? color[4] + color[4] : "")
		}
		return [
			parseInt(color.substr(1, 2), 16),
			parseInt(color.substr(3, 2), 16),
			parseInt(color.substr(5, 2), 16),
			color.length > 7 ? parseInt(color.substr(7, 2), 16) / 255 : 1,
		]
	}
	if (color.indexOf("rgb") === -1) {
		// convert named colors
		var temp_elem = document.body.appendChild(
			document.createElement("fictum"),
		) // intentionally use unknown tag to lower chances of css rule override with !important
		var flag = "rgb(1, 2, 3)" // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14
		temp_elem.style.color = flag
		if (temp_elem.style.color !== flag) return // color set failed - some monstrous css rule is probably taking over the color of our object
		temp_elem.style.color = color
		if (temp_elem.style.color === flag || temp_elem.style.color === "")
			return // color parse failed
		color = getComputedStyle(temp_elem).color
		document.body.removeChild(temp_elem)
	}
	if (color.indexOf("rgb") === 0) {
		if (color.indexOf("rgba") === -1) color += ",1" // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
		return color.match(/[\.\d]+/g)?.map(function (a) {
			return +a
		}) as [number, number, number, number]
	}
}

export function compareShape(source: any, target: any) {
	if (source == target) return true
	if (source == null || target == null) return false
	if (typeof source == "object") {
		// TODO: check deeper
		if (Array.isArray(source)) return Array.isArray(target)
		for (const key in source) {
			if (!compareShape(source[key], target[key])) return false
		}
		return true
	} else return typeof target == typeof source
}
