import type { Context, EditorConfig } from "src/types"

export function initState() {
	return {
		title: "",
		icon: "",
		links: [] as { label: string; url: string }[],
	}
}

export const editorConfig: EditorConfig = [
	{ type: "text", prop: "title", label: "Title:" },
	{
		type: "array",
		prop: "links",
		label: "Links:",
		subfields: [
			{ type: "text", prop: "label", label: "Label:" },
			{ type: "text", prop: "url", label: "URL:" },
		],
	},
]

const css = String.raw
const style = {
	container: css`
		display: flex;
		flex-direction: column;
		border: 1px solid black;
		border-radius: 0.5rem;
		padding: 0.5rem;
	`,
	title: css``,
}

export async function render(state: ReturnType<typeof initState>, _: Context) {
	const el = document.createElement("div")
	el.setAttribute("style", style.container)

	const title = document.createElement("h2")
	title.setAttribute("style", style.title)
	title.innerText = state.title
	el.appendChild(title)

	for (const link of state.links) {
		const a = document.createElement("a")
		a.href = link.url
		a.textContent = link.label
		el.appendChild(a)
	}

	return el
}

export const name = "Link list"
