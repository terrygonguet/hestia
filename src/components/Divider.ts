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
		state.direction == Direction.Vertical ? "vertical" : "horizontal"
	el.style.gap = state.gap
	el.style.padding = state.padding

	children.forEach(child => el.appendChild(child))

	return el
}
