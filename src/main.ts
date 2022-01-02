import "./reset.css"
import { Divider, DefaultDisplay, TestDiv } from "./components"
import { asyncMap } from "./utils"
import { nanoid } from "nanoid"
import { setupConfigWidget } from "./ConfigWidget"

const components = {
	Divider,
	TestDiv,
	DefaultDisplay,
}

async function getCustomComponent(_url: string): Promise<Component> {
	throw new Error("Not implemented yet")
}

async function render(definition: ComponentDefinition): Promise<Node> {
	const component: Component =
		definition.type == "Custom"
			? await getCustomComponent(definition.url)
			: components[definition.type]

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

browser.storage.local
	.get("root")
	.then(({ root }) =>
		render(root ?? { id: nanoid(), type: "DefaultDisplay" }),
	)
	.then(app => {
		setupConfigWidget()
		document.body.appendChild(app)
	})
