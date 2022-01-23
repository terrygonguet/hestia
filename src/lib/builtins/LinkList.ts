import type { Context, EditorConfig } from "$/types"

export function initState() {
	return import.meta.env.DEV
		? {
				title: "🔋 Procrastination",
				radius: "0",
				links: [
					{
						label: "YT",
						url: "https://www.youtube.com/feed/subscriptions",
					},
					{
						label: "YT WL",
						url: "https://www.youtube.com/playlist?list=WL",
					},
					{
						label: "/b/",
						url: "https://boards.4chan.org/b/",
					},
					{
						label: "/wg/",
						url: "https://boards.4chan.org/wg/",
					},
					{
						label: "OWL schedule",
						url: "https://overwatchleague.com/en-us/schedule",
					},
					{
						label: "OWL FR",
						url: "https://overwatchleague.com/fr-fr/",
					},
					{
						label: "Comics",
						url: "https://readcomiconline.to/",
					},
				],
		  }
		: {
				title: "",
				radius: "0",
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
		border: 1px solid var(--color-borders, black);
		padding: 0.5rem;
		min-height: 0;
	`,
	title: css`
		font-size: 1.3rem;
		font-weight: 600;
		word-break: keep-all;
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
