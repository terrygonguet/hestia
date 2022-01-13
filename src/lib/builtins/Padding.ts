import type { EditorConfig, Context } from "src/types"

export function initState() {
	return {
		padding: 1,
	}
}

export const editorConfig: EditorConfig = [
	{
		type: "number",
		prop: "padding",
		label: "Padding size:",
		min: 0,
		step: 0.25,
	},
]

const css = String.raw
const style = css`
	grid-template-columns: 1fr;
	grid-template-rows: 1fr;
	grid-auto-rows: 1fr;
	display: grid;
`

export async function render(
	state: ReturnType<typeof initState>,
	{ children }: Context,
) {
	const el = document.createElement("div")
	el.setAttribute("style", style)
	el.style.padding = state.padding + "rem"

	children.forEach(child => el.appendChild(child))

	return el
}

export const name = "Padding"
