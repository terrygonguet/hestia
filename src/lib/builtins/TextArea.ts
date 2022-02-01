import type { Context, EditorConfig } from "$/types"
import browser from "webextension-polyfill"

export function initState() {
	return {
		placeholder: "Type here...",
		text: "",
		border: true,
	}
}

export const editorConfig: EditorConfig = [
	{ type: "text", prop: "placeholder", label: "Placeholder" },
	{
		type: "boolean",
		prop: "border",
		label: "Border:",
	},
]

export async function render(
	state: ReturnType<typeof initState>,
	{ setState, id, onDestroy, css }: Context,
) {
	const el = document.createElement("textarea")
	el.id = id
	el.setAttribute("placeholder", state.placeholder)
	el.addEventListener("change", e => setState({ text: el.value }))
	el.value = state.text ?? ""
	el.style.border = state.border
		? "1px solid var(--color-borders, black)"
		: "none"

	css[`#${id}`] = `
		resize: none;
		padding: 0.5rem;
		background-color: var(--color-background, white);
		color: var(--color-text, black);
		outline: none;
		min-width: 0;
		min-height: 0;
		margin: 0;
	`

	function onStateChange(
		changes: { [key: string]: browser.Storage.StorageChange },
		areaName: string,
	) {
		if (areaName != "local" || !changes[id]) return
		el.value = changes[id].newValue?.text ?? ""
	}
	browser.storage.onChanged.addListener(onStateChange)

	onDestroy(() => browser.storage.onChanged.removeListener(onStateChange))

	return el
}

export const name = "Text area"
