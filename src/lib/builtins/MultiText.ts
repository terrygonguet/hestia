import type { Context, EditorConfig } from "$/types"

export function initState() {
	return {
		texts: [] as string[],
		center: true,
		size: 1,
	}
}

export const editorConfig: EditorConfig = [
	{ type: "boolean", prop: "center", label: "Centered:" },
	{ type: "number", prop: "size", label: "Text size:", min: 0.1, step: 0.1 },
	{
		type: "array",
		prop: "texts",
		label: "Options:",
		subfields: {
			type: "text",
			prop: "",
			label: "",
		},
	},
]

const css = String.raw
const style = css`
	display: flex;
`

export async function render(state: ReturnType<typeof initState>, _: Context) {
	const el = document.createElement("div")
	el.setAttribute("style", style)
	el.innerText = state.texts[Math.floor(Math.random() * state.texts.length)]
	if (state.center) {
		el.style.justifyContent = "center"
		el.style.alignItems = "center"
	}
	el.style.fontSize = state.size + "rem"

	return el
}

export const name = "Multi text"
