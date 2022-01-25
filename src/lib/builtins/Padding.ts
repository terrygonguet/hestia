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
	}
}

const html = String.raw
export const editorConfig: EditorConfig = [
	{
		type: "info",
		html: html`This component adds some whitespace padding around its
		contents. It only expects to have one child.`,
	},
	{
		type: "array",
		prop: "paddings",
		label: "Padding:",
		info: `
			When one value is specified, it applies the same padding to all four sides.
			When two values are specified, the first padding applies to the top and bottom, the second to the left and right.
			When three values are specified, the first padding applies to the top, the second to the right and left, the third to the bottom.
			When four values are specified, the paddings apply to the top, right, bottom, and left in that order (clockwise).
			Any values after the fourth are ignored.
		`,
		subfields: {
			type: "number",
			prop: "",
			label: "",
			min: 0,
			step: 0.25,
		},
	},
	{
		type: "select",
		prop: "overflow",
		label: "Overflow:",
		info: 'Overflow defines how the component behaves with regards to its contents and other "shrinking pressures" put on it. Try changing this setting when weird size changes occur.',
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
	{ children }: Context,
) {
	const el = document.createElement("div")
	el.setAttribute("style", style)
	el.style.padding = state.paddings
		.slice(0, 4)
		.map(n => n + "rem")
		.join(" ")
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

export const name = "Padding"
