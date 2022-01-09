export function flatten(root: ComponentDefinition): ComponentDefinition[] {
	return [root].concat(root.children?.flatMap(flatten) ?? [])
}

export function findById(component: ComponentDefinition, id: string) {
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

export function findParentOfId(component: ComponentDefinition, id: string) {
	return flatten(component).find(c => c.children?.find(cc => cc.id == id))
}
