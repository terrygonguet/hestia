import type { Component, ComponentDefinition } from "src/types"
import { asyncMap, getCustomComponent } from "../utils"
import { builtins } from "./builtins"

export async function render(
	definition: ComponentDefinition,
	onDestroyCallbacks: (() => void)[] = [],
): Promise<{ el: Node; onDestroy: (() => void)[] }> {
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
	const state = await browser.storage.local.get(definition.id)

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
		},
	)

	return { el, onDestroy: onDestroyCallbacks }
}
