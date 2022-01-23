import type { EditorConfig, Context } from "$/types"

enum Overflow {
	Hidden,
	Auto,
	Visible,
}

export function initState() {
	return {
		padding: 1,
		overflow: Overflow.Hidden,
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
		type: "number",
		prop: "padding",
		label: "Padding size:",
		min: 0,
		step: 0.25,
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
	el.style.padding = state.padding + "rem"
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
