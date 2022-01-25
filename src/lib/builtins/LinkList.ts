import type { Context, EditorConfig } from "$/types"

export function initState() {
	return {
		title: "",
		radius: "0",
		border: true,
		links: [] as { label: string; url: string }[],
	}
}

export const editorConfig: EditorConfig = [
	{
		type: "text",
		prop: "title",
		label: "Title:",
		placeholder: "No title will be shown if blank",
	},
	{
		type: "boolean",
		prop: "border",
		label: "Border:",
	},
	{
		type: "select",
		prop: "radius",
		label: "Corners:",
		options: [
			{ label: "Square", value: "0" },
			{ label: "Slightly rounded", value: "0.2rem" },
			{ label: "Rounded", value: "0.5rem" },
			{ label: "Very rounded", value: "1rem" },
		],
	},
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
		padding: 0.5rem;
		min-height: 0;
		overflow: auto;
	`,
	title: css`
		font-size: 1.3rem;
		font-weight: 600;
		word-break: keep-all;
		position: sticky;
		top: 0;
		background: var(--color-background, white);
	`,
	icon: css`
		display: inline;
	`,
	link: css`
		text-decoration: none;
		color: var(--color-text, black);
	`,
}

export async function render(state: ReturnType<typeof initState>, _: Context) {
	const el = document.createElement("div")
	el.setAttribute("style", style.container)
	if (state.border) el.style.border = "1px solid var(--color-borders, black)"
	el.style.borderRadius = state.radius

	if (state.title) {
		const title = document.createElement("h2")
		title.setAttribute("style", style.title)
		title.innerText = state.title
		el.appendChild(title)
	}

	for (const link of state.links) {
		const a = document.createElement("a")
		a.setAttribute("style", style.link)
		a.href = link.url
		a.textContent = link.label
		el.appendChild(a)
	}

	return el
}

export const name = "Link list"
