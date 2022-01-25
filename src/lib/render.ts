import { baseConfig } from "$/Options.svelte"
import type { Component, ComponentDefinition } from "$/types"
import { asyncMap, getCustomComponent } from "$/utils"
import { builtins } from "$lib/builtins"
import browser from "webextension-polyfill"

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
