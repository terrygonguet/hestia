import type { Context } from "src/types"

export function initState() {
	return {
		text: "",
	}
}

const css = String.raw
const style = css`
	resize: none;
`

export async function render(
	state: ReturnType<typeof initState>,
	{ setState }: Context,
) {
	const el = document.createElement("textarea")
	el.setAttribute("style", style)
	el.addEventListener("change", e => setState({ text: el.value }))
	el.value = state.text ?? ""

	return el
}

export const name = "Text area"
