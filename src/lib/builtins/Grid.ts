import type { EditorConfig, Context } from "$/types"

export function initState() {
	return {
		cols: 6,
		rows: 2,
		gap: 1,
	}
}

export const editorConfig: EditorConfig = [
	{ type: "number", prop: "cols", label: "Columns:", min: 1 },
	{ type: "number", prop: "rows", label: "Rows:", min: 1 },
	{
		type: "number",
		prop: "gap",
		label: "Gap size:",
		min: 0,
		step: 0.25,
		info: "The size of the gutter between items.",
	},
]

const css = String.raw
const style = css`
	display: grid;
`

export async function render(
	state: ReturnType<typeof initState>,
	{ children }: Context,
) {
	const el = document.createElement("div")
	el.setAttribute("style", style)
	el.style.gap = state.gap + "rem"
	el.style.gridTemplateColumns = `repeat(${state.cols}, 1fr)`
	el.style.gridTemplateRows = `repeat(${state.rows}, 1fr)`

	children.forEach(child => el.appendChild(child))

	return el
}

export const name = "Grid"
