import type { Context, EditorConfig } from "src/types"

enum Direction {
	Vertical,
	Horizontal,
}

export function initState() {
	return {
		gap: 1,
		direction: Direction.Vertical,
	}
}

export const editorConfig: EditorConfig = [
	{
		type: "number",
		prop: "gap",
		label: "Gap size:",
		min: 0,
		step: 0.25,
		info: "The size of the gutter between items.",
	},
	{
		type: "select",
		prop: "direction",
		label: "Direction:",
		options: [
			{ label: "Vertical", value: Direction.Vertical },
			{ label: "Horizontal", value: Direction.Horizontal },
		],
	},
]

const css = String.raw
const style = css`
	display: flex;
`

export async function render(
	state: ReturnType<typeof initState>,
	{ children }: Context,
) {
	const el = document.createElement("div")
	el.setAttribute("style", style)
	el.style.gap = state.gap + "rem"
	el.style.flexDirection =
		state.direction == Direction.Vertical ? "column" : "row"

	children.forEach(child => el.appendChild(child))

	return el
}

export const name = "Container"
