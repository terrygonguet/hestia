import { asyncMap, getCustomComponent } from "../utils"
import { builtins } from "./builtins"

export async function render(definition: ComponentDefinition): Promise<Node> {
	const component: Component =
		definition.type == "Custom"
			? await getCustomComponent(definition.url)
			: builtins[definition.type]

	if (!component) {
		throw new Error(`Unknown component type "${definition.type}"`)
	}

	const children = await asyncMap(definition.children ?? [], render)
	const state = await browser.storage.local.get(definition.id)

	function setState(data: Object) {
		return browser.storage.local.set({ [definition.id]: data })
	}

	const el = component.render(state[definition.id] ?? component.initState(), {
		children,
		setState,
	})

	return el
}
