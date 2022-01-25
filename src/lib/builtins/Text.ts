import type { Context, EditorConfig } from "$/types"

export function initState() {
	return {
		text: "",
		center: true,
		size: 1,
		bold: false,
	}
}

export const editorConfig: EditorConfig = [
	{ type: "text", prop: "text", label: "Text:" },
	{ type: "boolean", prop: "center", label: "Centered:" },
	{ type: "number", prop: "size", label: "Text size:", min: 0.1, step: 0.1 },
	{ type: "boolean", prop: "bold", label: "Bold:" },
]

const css = String.raw
const style = css`
	display: flex;
`

export async function render(state: ReturnType<typeof initState>, _: Context) {
	const el = document.createElement("div")
	el.setAttribute("style", style)
	el.innerText = state.text ?? ""
	if (state.center) {
		el.style.justifyContent = "center"
		el.style.alignItems = "center"
	}
	el.style.fontSize = state.size + "rem"
	if (state.bold) el.style.fontWeight = "bold"

	return el
}

export const name = "Text"
