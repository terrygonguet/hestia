import type { Context, EditorConfig } from "$/types"
import browser from "webextension-polyfill"
import TODOList from "$lib/builtins/TODOList.svelte"
import { nanoid } from "nanoid"

export type TODO = {
	name: string
	done: boolean
	id: string
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
	// {
	// 	type: "array",
	// 	prop: "todos",
	// 	label: "TODOs:",
	// 	subfields: [
	// 		{ type: "text", prop: "name", label: "Label:" },
	// 		{ type: "boolean", prop: "done", label: "Done:" },
	// 	],
	// },
]

const css = String.raw

export async function render(
	state: ReturnType<typeof initState>,
	{ onDestroy, id, setState }: Context,
) {
	const el = document.createElement("div")
	el.setAttribute(
		"style",
		css`
			min-height: 0;
			overflow: hidden;
		`,
	)
	const comp = new TODOList({
		target: el,
		props: state,
	})
	const removeToggle = comp.$on("toggle", ({ detail: id }) => {
		const todo = state.todos.find(t => t.id == id)
		if (todo) todo.done = !todo.done
		setState({ todos: state.todos })
	})
	const removeCreate = comp.$on("create", ({ detail: name }) =>
		setState({
			todos: [
				...state.todos,
				{
					id: nanoid(),
					done: false,
					name,
				},
			],
		}),
	)
	const removeDelete = comp.$on("remove", ({ detail: id }) =>
		setState({
			todos: state.todos.filter(t => t.id != id),
		}),
	)

	function onStateChange(
		changes: { [key: string]: browser.Storage.StorageChange },
		areaName: string,
	) {
		if (areaName != "local" || !changes[id]?.newValue) return
		state = changes[id].newValue
		comp.$set(state)
	}
	browser.storage.onChanged.addListener(onStateChange)
	onDestroy(() => {
		browser.storage.onChanged.removeListener(onStateChange)
		removeToggle()
		removeCreate()
		removeDelete()
	})

	return el
}

export const name = "TODO list"
