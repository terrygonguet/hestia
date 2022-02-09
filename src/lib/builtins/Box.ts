import type { EditorConfig, Context } from "$/types"

enum Overflow {
	Hidden,
	Auto,
	Visible,
}

export function initState() {
	return {
		overflow: Overflow.Hidden,
		paddings: [1],
		border: false,
		grow: true,
		colspan: 1,
		rowspan: 1,
	}
}

const html = String.raw
export const editorConfig: EditorConfig = [
	{
		type: "info",
		html: html`This component controls the space taken inside its container
		and the whitespace padding around its contents. It only expects to have
		one child.`,
	},
	{
		type: "divider",
	},
	{
		type: "info",
		html: html`When <strong>one</strong> value is specified, it applies the
			same padding to all four sides.`,
	},
	{
		type: "info",
		html: html`When <strong>two</strong> values are specified, the first
			padding applies to the <strong>top and bottom</strong>, the second
			to the <strong>left and right</strong>.`,
	},
	{
		type: "info",
		html: html`When <strong>three</strong> values are specified, the first
			padding applies to the <strong>top</strong>, the second to the
			<strong>right and left</strong>, the third to the
			<strong>bottom</strong>.`,
	},
	{
		type: "info",
		html: html`When <strong>four</strong> values are specified, the paddings
			apply to the <strong>top, right, bottom, and left</strong> in that
			order (clockwise).`,
	},
	{
		type: "array",
		prop: "paddings",
		label: "Padding:",
		info: html`Any values after the fourth are ignored.`,
		subfields: {
			type: "number",
			prop: "",
			label: "",
			min: 0,
			step: 0.25,
		},
	},
	{ type: "divider" },
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
	{
		type: "divider",
	},
	{
		type: "info",
		html: html`Overflow defines how the component behaves with regards to
		its contents and other "shrinking pressures" put on it. Try changing
		this setting when weird size changes occur.`,
	},
	{
		type: "select",
		prop: "overflow",
		label: "Overflow:",
		options: [
			{ label: "Hidden", value: Overflow.Hidden },
			{ label: "Auto", value: Overflow.Auto },
			{ label: "Visible", value: Overflow.Visible },
		],
	},
]

const css = String.raw
const style = css`
	grid-template-columns: 1fr;
	grid-template-rows: 1fr;
	display: grid;
	overflow: hidden;
`

export async function render(
	state: ReturnType<typeof initState>,
	{ children, id, css }: Context,
) {
	const el = document.createElement("div")
	el.id = id
	el.style.padding = state.paddings
		.slice(0, 4)
		.map(n => n + "rem")
		.join(" ")
	if (state.border) el.style.border = "2px solid var(--color-accent, red)"
	if (state.grow) el.style.flexGrow = "1"
	el.style.gridColumn = "span " + state.colspan
	el.style.gridRow = "span " + state.rowspan
	css[`#${id}`] = `
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: 1fr;
		min-height: 0;
	`
	switch (state.overflow) {
		case Overflow.Hidden:
			el.style.overflow = "hidden"
			break
		case Overflow.Auto:
			el.style.overflow = "auto"
			break
		case Overflow.Visible:
			el.style.overflow = "visible"
			break
	}

	children.forEach(child => el.appendChild(child))

	return el
}

export const name = "Box"
