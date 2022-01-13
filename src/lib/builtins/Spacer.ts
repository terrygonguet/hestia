import type { Context, EditorConfig } from "src/types"

export function initState() {
	return { border: false, grow: true, colspan: 1, rowspan: 1 }
}

export const editorConfig: EditorConfig = [
	{
		type: "boolean",
		prop: "grow",
		label: "Grow:",
		info: "Only used when direct child of a Container. Grow to take all available space when enabled.",
	},
	{
		type: "number",
		prop: "colspan",
		label: "Column span:",
		min: 1,
		info: "Both options are only used when direct child of a Grid.",
	},
	{ type: "number", prop: "rowspan", label: "Row span:", min: 1 },
	{
		type: "boolean",
		prop: "border",
		label: "Red border:",
		info: "Useful to visualize the available space.",
	},
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
	if (state.border) el.style.border = "2px solid red"
	if (state.grow) el.style.flexGrow = "1"
	el.style.gridColumn = "span " + state.colspan
	el.style.gridRow = "span " + state.rowspan

	children.forEach(child => el.appendChild(child))

	return el
}

export const name = "Spacer"
