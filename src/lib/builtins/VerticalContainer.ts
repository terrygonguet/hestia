import type { Context, EditorConfig } from "src/types"

export function initState() {
	return {
		gap: 1,
	}
}

export const editorConfig: EditorConfig = [
	{ type: "number", prop: "gap", label: "Gap size:", min: 0, max: 5 },
]

const css = String.raw
const style = css`
	display: grid;
	grid-template-columns: 1fr;
	grid-auto-rows: 1fr;
`

export async function render(
	state: ReturnType<typeof initState>,
	{ children }: Context,
) {
	const el = document.createElement("div")
	el.setAttribute("style", style)
	el.style.gap = state.gap + "rem"

	children.forEach(child => el.appendChild(child))

	return el
}

export const name = "Vertical container"
