import { baseConfig } from "$/Options.svelte"
import type { Component, ComponentDefinition } from "$/types"
import { asyncMap, getCustomComponent } from "$/utils"
import { builtins } from "$lib/builtins"
import browser from "webextension-polyfill"
import parser from "postcss-selector-parser"
import hotkeys from "hotkeys-js"

export async function render(
	definition: ComponentDefinition,
	onDestroyCallbacks: (() => void)[] = [],
	cache?: { [id: string]: any },
): Promise<{ el: Node; onDestroy: (() => void)[] }> {
	try {
		const component: Component =
			definition.type == "Custom"
				? await getCustomComponent(definition.url)
				: builtins[definition.type]
		const stateCache = cache ?? (await browser.storage.local.get())

		if (!component) {
			throw new Error(`Unknown component type "${definition.type}"`)
		}

		const children = await asyncMap(definition.children ?? [], child =>
			render(child, onDestroyCallbacks, stateCache),
		)

		async function setState(data: Object) {
			const state = await browser.storage.local.get(definition.id)
			const newState = Object.assign({}, state[definition.id], data)
			return browser.storage.local.set({
				[definition.id]: newState,
			})
		}

		function onDestroy(f: () => void) {
			onDestroyCallbacks.push(f)
		}

		const el = await component.render(
			Object.assign(component.initState(), stateCache[definition.id]),
			{
				children: children.map(c => c.el),
				setState,
				onDestroy,
				config: stateCache.config ?? baseConfig(),
				id: definition.id,
				css: createCSSProxy(definition.id),
				hotkeys,
			},
		)

		return { el, onDestroy: onDestroyCallbacks }
	} catch (error) {
		console.error(error)
		return {
			el: document.createElement("div"),
			onDestroy: onDestroyCallbacks,
		}
	}
}

function createCSSProxy(id: string) {
	const style = document.createElement("style")
	style.id = id

	const map = new Map<string, string>()
	return new Proxy<{ [selector: string]: string }>(
		{},
		{
			get(_, selector) {
				if (typeof selector == "symbol")
					throw new Error("Can't use symbols as a CSS selector")
				return map.get(selector)
			},
			set(_, selector, value) {
				if (typeof selector == "symbol")
					throw new Error("Can't use symbols as a CSS selector")
				map.set(selector, value)
				updateStyle(style, map)
				return true
			},
			isExtensible: () => false,
			ownKeys() {
				return Array.from(map.keys())
			},
			setPrototypeOf: () => false,
			defineProperty(_, selector, descriptor) {
				return false
			},
			deleteProperty(_, selector) {
				if (typeof selector == "symbol")
					throw new Error("Can't use symbols as a CSS selector")
				const result = map.delete(selector)
				updateStyle(style, map)
				return result
			},
		},
	)
}

function updateStyle(el: HTMLStyleElement, map: Map<string, string>) {
	if (!el.parentElement) document.head.appendChild(el)
	let contents = ""
	for (const [selector, props] of map) {
		contents += processor.processSync(selector) + " {" + props + "}\n"
	}
	el.innerHTML = contents
}

const processor = parser(nodes => {
	nodes.walkIds(node => void (node.value = CSS.escape(node.value)))
	nodes.walkClasses(node => void (node.value = CSS.escape(node.value)))
})
