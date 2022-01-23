import type { EditorConfig, Context } from "$/types"

export function initState() {
	return {
		cols: 6,
		rows: 2,
		gap: 1,
		grow: true,
		placeholders: false,
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
	{
		type: "boolean",
		prop: "grow",
		label: "Grow:",
		info: "Grow to take all available space when child of <code>Container</code>.",
	},
	{
		type: "boolean",
		prop: "placeholders",
		label: "Visualize slots:",
		info: "Useful to see what the grid may look like once full.",
	},
]

const css = String.raw
const style = css`
	display: grid;
	min-height: 0;
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
	if (state.grow) el.style.flexGrow = "1"

	children.forEach(child => el.appendChild(child))

	if (state.placeholders) {
		for (let i = 0; i < state.cols * state.rows - children.length; i++) {
			const div = document.createElement("div")
			div.style.border = "1px solid var(--color-accent)"
			el.appendChild(div)
		}
	}

	return el
}

export const name = "Grid"
