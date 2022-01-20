import { baseConfig } from "$/Options.svelte"
import type { Component, ComponentDefinition } from "$/types"
import { asyncMap, getCustomComponent } from "$/utils"
import { builtins } from "$lib/builtins"
import browser from "webextension-polyfill"

export async function render(
	definition: ComponentDefinition,
	onDestroyCallbacks: (() => void)[] = [],
): Promise<{ el: Node; onDestroy: (() => void)[] }> {
	try {
		const component: Component =
			definition.type == "Custom"
				? await getCustomComponent(definition.url)
				: builtins[definition.type]

		if (!component) {
			throw new Error(`Unknown component type "${definition.type}"`)
		}

		const children = await asyncMap(definition.children ?? [], c =>
			render(c, onDestroyCallbacks),
		)
		const state = await browser.storage.local.get([definition.id, "config"])

		function setState(data: Object) {
			return browser.storage.local.set({ [definition.id]: data })
		}

		function onDestroy(f: () => void) {
			onDestroyCallbacks.push(f)
		}

		const el = await component.render(
			Object.assign(component.initState(), state[definition.id]),
			{
				children: children.map(c => c.el),
				setState,
				onDestroy,
				config: state.config ?? baseConfig,
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
