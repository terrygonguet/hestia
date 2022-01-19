import type { ComponentDefinition } from "$/types"
import type { Maybe } from "$/utils/maybe"
import { builtins } from "$lib/builtins"
import { nanoid } from "nanoid"

export function flatten(root: ComponentDefinition): ComponentDefinition[] {
	return [root].concat(root.children?.flatMap(flatten) ?? [])
}

export function findById(
	component: ComponentDefinition,
	id: string,
): Maybe<ComponentDefinition> {
	return flatten(component).find(c => c.id == id)
}

export function addChild(
	parent: ComponentDefinition,
	child: ComponentDefinition,
	after?: string,
) {
	if (!parent.children) parent.children = [child]
	else if (after) {
		let i = parent.children.findIndex(c => c.id == after)
		if (i == -1) parent.children.push(child)
		else parent.children.splice(i + 1, 0, child)
	} else parent.children.push(child)
}

export function deleteById(component: ComponentDefinition, id: string) {
	const flat = flatten(component)
	for (const definition of flat) {
		definition.children = definition.children?.filter(c => c.id != id)
	}
}

export function findParentOfId(
	component: ComponentDefinition,
	id: string,
): Maybe<ComponentDefinition> {
	return flatten(component).find(c => c.children?.find(cc => cc.id == id))
}

export function forEach(
	component: ComponentDefinition,
	f: (comp: ComponentDefinition) => void,
) {
	component.children?.forEach(c => forEach(c, f))
	f(component)
}

export function clone(definition: ComponentDefinition): ComponentDefinition {
	return {
		...definition,
		id: nanoid(),
		children: definition.children?.map(clone),
	}
}

export function parse(value: any): Maybe<ComponentDefinition> {
	if (!value) return
	if (typeof value != "object" || Array.isArray(value)) return
	if (typeof value.id != "string" || typeof value.type != "string") return
	const types = Object.keys(builtins).concat("Custom")
	if (!types.includes(value.type)) return
	if (value.children && !Array.isArray(value.children)) return
	if (value.name && typeof value.name != "string") return
	if (value.type == "Custom" && typeof value.url != "string") return

	value.children = value.children?.map(parse)?.filter(Boolean)

	return value
}
