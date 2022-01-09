export function initState() {
	return { grow: true }
}

export async function render(state: ReturnType<typeof initState>, _: Context) {
	const el = document.createElement("div")
	el.style.border = "2px solid red"
	el.style.flexGrow = state.grow ? "1" : "0"

	return el
}

export const name = "Test div"
