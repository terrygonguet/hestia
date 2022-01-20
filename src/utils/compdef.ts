import type { ComponentDefinition } from "$/types"
import type { Maybe } from "$/utils/maybe"
import { Left, Right, isLeft } from "$/utils/result"
import type { Result } from "$/utils/result"
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

export function parse(value: any): Result<string, ComponentDefinition> {
	if (!value || typeof value != "object" || Array.isArray(value))
		return Left("Value is not an object.")
	if (typeof value.id != "string" || typeof value.type != "string")
		return Left("Missing 'id' or 'type' property.")
	const types = Object.keys(builtins).concat("Custom")
	if (!types.includes(value.type))
		return Left("Invalid value for property 'type': " + value.type + ".")
	if (value.children && !Array.isArray(value.children))
		return Left("Property 'children' is present but is not an array.")
	if (value.name && typeof value.name != "string")
		return Left("Property 'name' is present but is not a string.")
	if (value.type == "Custom" && typeof value.url != "string")
		return Left("Property 'url' is not a string for a custom component.")

	const children = value.children?.map(parse)
	const left = children?.find(isLeft)
	if (left) return left
	else value.children = children?.map((c: any) => c.value)

	return Right(value)
}
