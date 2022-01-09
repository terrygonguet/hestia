enum Direction {
	Vertical,
	Horizontal,
}

export function initState() {
	return {
		gap: "1rem",
		padding: "1rem",
		direction: Direction.Vertical,
	}
}

export const editorConfig: EditorConfig = [
	{ type: "text", prop: "gap", label: "Gap:" },
	{ type: "text", prop: "padding", label: "Padding:" },
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
	height: 100%;
`

export async function render(
	state: ReturnType<typeof initState>,
	{ children }: Context,
) {
	const el = document.createElement("div")
	el.setAttribute("style", style)
	el.style.flexDirection =
		state.direction == Direction.Vertical ? "column" : "row"
	el.style.gap = state.gap
	el.style.padding = state.padding

	children.forEach(child => el.appendChild(child))

	return el
}

export const name = "Divider"
