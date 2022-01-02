import { html, render } from "lit-html"
import type { TemplateResult } from "lit-html"
import { nanoid } from "nanoid"

function findById(
	component: ComponentDefinition,
	id: string,
): ComponentDefinition | undefined {
	if (component.id == id) return component
	else return component.children?.find(c => findById(c, id))
}

function addChild(
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

function deleteById(component: ComponentDefinition, id: string) {
	const i = component.children?.findIndex(c => c.id == id) ?? -1
	if (i == -1) component.children?.forEach(c => deleteById(c, id))
	else component.children?.splice(i, 1)
	return component
}

function getParentOfId(
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

;(async function () {
	function component(
		definition: ComponentDefinition,
		depth = 0,
	): TemplateResult<1> {
		return html`
			<label
				style="--depth:${depth}"
				class=${selected == definition.id ? "selected" : ""}
			>
				<input
					type="radio"
					value=${definition.id}
					name="component"
					@change=${onRadioChange(definition)}
				/>
				${definition.type}
			</label>
			${definition.children?.map(child => component(child, depth + 1))}
		`
	}
	function page() {
		console.log(root && findById(root, selected))
		return html`<form name="tree" id="tree" onsubmit="return false">
				<fieldset id="components">
					<legend>Components</legend>
					${root ? component(root) : ""}
				</fieldset>
				<div id="tree-commands">
					<button
						type="button"
						title="Create component and add as child of selected"
						@click=${onClickAdd}
					>
						+
					</button>
					<button
						type="button"
						title="Delete component"
						@click=${onClickDelete}
					>
						-
					</button>
					<button
						type="button"
						title="Make sibling of parent of selected"
						@click=${onClickRise}
					>
						⇤
					</button>
					<button
						type="button"
						title="Make child of next sibling of selected"
					>
						⇥
					</button>
					<button type="button" title="Move selected up">⇧</button>
					<button type="button" title="Move seleted down">⇩</button>
				</div>
			</form>
			<form id="props" onsubmit="return false">
				<fieldset>
					<legend>Properties</legend>
				</fieldset>
			</form>`
	}

	function onClickAdd() {
		const child: ComponentDefinition = { id: nanoid(), type: "TestDiv" }
		if (!root) {
			root = child
		} else if (!selected) {
			addChild(root, child)
		} else {
			const parent = findById(root, selected)
			addChild(parent ?? root, child, selected)
		}
		update()
	}

	function onClickDelete() {
		if (!selected || !root) return
		if (
			selected == root.id &&
			confirm("Are you sure you want to delete ALL the components?!")
		) {
			root = undefined
			browser.storage.local.remove("root").then(() => update())
		} else if (
			confirm(
				"Are you sure you want to delete this component and ALL of its children?!",
			)
		)
			deleteById(root, selected)
		update()
	}

	function onClickRise() {
		console.log(root && getParentOfId(root, selected))
	}

	function onRadioChange(definition: ComponentDefinition) {
		return function () {
			selected = definition.id
			update()
		}
	}

	async function update(save = true) {
		if (root && save) await browser.storage.local.set({ root })
		render(page(), document.body)
	}

	let { root } = await browser.storage.local.get("root")
	let selected = root?.id ?? ""

	await update(false)
})()
