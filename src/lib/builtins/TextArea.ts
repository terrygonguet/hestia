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

const css = String.raw
const style = css`
	resize: none;
	padding: 0.5rem;
	background-color: var(--color-background, white);
	color: var(--color-text, black);
	outline: none;
	min-width: 0;
	min-height: 0;
	margin: 0;
`

export async function render(
	state: ReturnType<typeof initState>,
	{ setState, id, onDestroy }: Context,
) {
	const el = document.createElement("textarea")
	el.setAttribute("style", style)
	el.setAttribute("placeholder", state.placeholder)
	el.addEventListener("change", e => setState({ text: el.value }))
	el.value = state.text ?? ""
	el.style.border = state.border
		? "1px solid var(--color-borders, black)"
		: "none"

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
