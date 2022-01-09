export async function asyncMap<T, U>(
	array: T[],
	f: (el: T, i: number) => Promise<U>,
): Promise<U[]> {
	return Promise.all(array.map(f))
}

export function flatten(root: ComponentDefinition): ComponentDefinition[] {
	return [root].concat(root.children?.flatMap(flatten) ?? [])
}

export function findById(
	component: ComponentDefinition,
	id: string,
): ComponentDefinition | undefined {
	if (component.id == id) return component
	else return component.children?.find(c => findById(c, id))
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
	const i = component.children?.findIndex(c => c.id == id) ?? -1
	if (i == -1) component.children?.forEach(c => deleteById(c, id))
	else component.children?.splice(i, 1)
	return component
}

export function getParentOfId(
	component: ComponentDefinition,
	id: string,
): ComponentDefinition | undefined {
	if (component.id == id) return
	if (component.children?.find(c => c.id == id)) return component
	for (const child of component.children ?? []) {
		const descendant = getParentOfId(child, id)
		if (descendant) return descendant
	}
	return
}
