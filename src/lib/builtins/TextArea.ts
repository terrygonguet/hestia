import type { Context } from "$/types"

export function initState() {
	return {
		text: "",
	}
}

const css = String.raw
const style = css`
	resize: none;
	padding: 0.5rem;
	background-color: var(--color-background, white);
	color: var(--color-text, black);
	border: none;
	outline: solid 1px var(--color-borders, black);
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
