import type { Context, EditorConfig } from "$/types"
import partition from "just-partition"
import browser from "webextension-polyfill"

type TODO = {
	name: string
	done: boolean
}

export function initState() {
	return {
		title: "",
		radius: "0",
		todos: [] as TODO[],
	}
}

export const editorConfig: EditorConfig = [
	{
		type: "text",
		prop: "title",
		label: "Title:",
		placeholder: "No title will be shown if blank",
	},
	{
		type: "select",
		prop: "radius",
		label: "Corners:",
		options: [
			{ label: "Square", value: "0" },
			{ label: "Slightly rounded", value: "0.2rem" },
			{ label: "Rounded", value: "0.5rem" },
			{ label: "Very rounded", value: "1rem" },
		],
	},
	{
		type: "array",
		prop: "todos",
		label: "TODOs:",
		subfields: [
			{ type: "text", prop: "name", label: "Label:" },
			{ type: "boolean", prop: "done", label: "Done:" },
		],
	},
]

const css = String.raw
const style = {
	container: css`
		display: flex;
		flex-direction: column;
		border: 1px solid var(--color-borders, black);
		padding: 0.5rem;
		gap: 0.8rem;
		accent-color: var(--color-accent);
	`,
	title: css`
		text-align: center;
		font-size: 1.3rem;
		font-weight: 600;
		word-break: keep-all;
	`,
	list: css`
		display: flex;
		flex-direction: column;
	`,
}
export async function render(
	state: ReturnType<typeof initState>,
	{ onDestroy, id }: Context,
) {
	const el = document.createElement("div")
	el.setAttribute("style", style.container)
	el.style.borderRadius = state.radius

	if (state.title) {
		const title = document.createElement("h2")
		title.setAttribute("style", style.title)
		title.innerText = state.title
		el.appendChild(title)
	}

	const notdones = document.createElement("div")
	notdones.setAttribute("style", style.list)
	el.appendChild(notdones)
	const dones = document.createElement("div")
	dones.setAttribute("style", style.list)
	el.appendChild(dones)

	function buildTODOs(todos: TODO[]) {
		notdones.innerHTML = ""
		dones.innerHTML = ""
		const [done, todo] = partition(
			todos.map((todo, i) => [i, todo] as [number, TODO]),
			([, { done }]) => done,
		)
		todo.map(createTODO).forEach(l => notdones.appendChild(l))
		done.map(createTODO).forEach(l => dones.appendChild(l))
	}
	buildTODOs(state.todos)

	function onStateChange(
		changes: { [key: string]: browser.Storage.StorageChange },
		areaName: string,
	) {
		if (areaName != "local" || !changes[id]?.newValue) return
		buildTODOs(changes[id].newValue.todos)
	}
	browser.storage.onChanged.addListener(onStateChange)
	onDestroy(() => browser.storage.onChanged.removeListener(onStateChange))

	return el
}

export const name = "TODO list"

function createTODO([i, { name, done }]: [number, TODO]) {
	const label = document.createElement("label")
	const checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.checked = done
	label.appendChild(checkbox)
	label.append(name)

	return label
}
