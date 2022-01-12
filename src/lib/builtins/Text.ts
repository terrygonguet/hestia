import type { Context, EditorConfig } from "src/types"

export function initState() {
	return {
		text: "",
		center: true,
		size: 1,
	}
}

export const editorConfig: EditorConfig = [
	{ type: "text", prop: "text", label: "Text:" },
	{ type: "boolean", prop: "center", label: "Centered:" },
	{ type: "number", prop: "size", label: "Text size:", min: 0.1, step: 0.1 },
]

const css = String.raw
const style = css``

export async function render(state: ReturnType<typeof initState>, _: Context) {
	const el = document.createElement("div")
	el.setAttribute("style", style)
	el.innerText = state.text
	if (state.center) el.style.textAlign = "center"
	el.style.fontSize = state.size + "rem"

	return el
}

export const name = "Text"
