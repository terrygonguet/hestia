import type { Context, EditorConfig } from "$/types"

export function initState() {
	return { border: false, grow: true, colspan: 1, rowspan: 1 }
}

const html = String.raw
export const editorConfig: EditorConfig = [
	{
		type: "info",
		html: html`Only used when direct child of a <code>Stack</code>.`,
	},
	{
		type: "boolean",
		prop: "grow",
		label: "Grow:",
		info: html`Grow to take all available space when enabled.`,
	},
	{ type: "divider" },
	{
		type: "info",
		html: html`Only used when direct child of a <code>Grid</code>.`,
	},
	{
		type: "number",
		prop: "colspan",
		label: "Column span:",
		min: 1,
	},
	{ type: "number", prop: "rowspan", label: "Row span:", min: 1 },
	{ type: "divider" },
	{
		type: "boolean",
		prop: "border",
		label: "Flashy border:",
		info: "Useful to visualize the available space.",
	},
]

export async function render(
	state: ReturnType<typeof initState>,
	{ children, id, css }: Context,
) {
	const el = document.createElement("div")
	el.id = id
	if (state.border) el.style.border = "2px solid var(--color-accent, red)"
	if (state.grow) el.style.flexGrow = "1"
	el.style.gridColumn = "span " + state.colspan
	el.style.gridRow = "span " + state.rowspan
	css[`#${id}`] = `
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: 1fr;
		min-height: 0;
		overflow: hidden;
	`

	children.forEach(child => el.appendChild(child))

	return el
}

export const name = "Spacer"
