import type { Context, EditorConfig } from "src/types"

export function initState() {
	return { border: false }
}

export const editorConfig: EditorConfig = [
	{ type: "boolean", prop: "border", label: "Red border:" },
]

export async function render(state: ReturnType<typeof initState>, _: Context) {
	const el = document.createElement("div")
	if (state.border) el.style.border = "2px solid red"

	return el
}

export const name = "Spacer"
