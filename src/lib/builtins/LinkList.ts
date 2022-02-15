import type { Context, EditorConfig } from "$/types"

export function initState() {
	return {
		title: "",
		radius: "0",
		border: true,
		hover: false,
		links: [] as { label: string; url: string; hotkey?: string }[],
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
		type: "boolean",
		prop: "hover",
		label: "Underline:",
		info: "Underline links on hover",
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
			{ type: "text", prop: "hotkey", label: "Hotkey:" },
		],
	},
]

const css = String.raw
export async function render(
	state: ReturnType<typeof initState>,
	{ id, css: styles, hotkeys, onDestroy }: Context,
) {
	const el = document.createElement("div")
	el.id = id
	if (state.border) el.style.border = "1px solid var(--color-borders, black)"
	el.style.borderRadius = state.radius

	styles[`#${id}`] = css`
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		min-height: 0;
		overflow: auto;
		gap: 0.5rem;
	`
	styles[`#${id} > h2`] = css`
		font-size: 1.3rem;
		font-weight: 600;
		word-break: keep-all;
		position: sticky;
		top: 0;
		background: var(--color-background, white);
	`

	styles[`#${id} > a`] = css`
		text-decoration: none;
		color: var(--color-text, black);
		display: grid;
		grid-template-columns: 1fr auto;
		line-height: 1;
	`
	if (state.hover) {
		styles[`#${id} > a:hover`] = css`
			text-decoration: underline;
		`
	}

	styles[`#${id} .label`] = css`
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	`
	styles[`#${id} .hotkey`] = css`
		border: 1px solid var(--color-borderCode);
		background: var(--color-backgroundCode);
		color: var(--color-textCode);
		padding: 0 0.25rem;
		border-radius: 0.25rem;
		font-family: monospace;
	`

	if (state.title) {
		const title = document.createElement("h2")
		title.innerText = state.title
		el.appendChild(title)
	}

	for (const link of state.links) {
		const a = document.createElement("a")
		a.href = link.url
		el.appendChild(a)

		const label = document.createElement("span")
		label.classList.add("label")
		label.textContent = link.label
		a.appendChild(label)

		if (link.hotkey) {
			const hk = document.createElement("code")
			hk.textContent = link.hotkey
			hk.classList.add("hotkey")
			a.appendChild(hk)
		}
	}

	const unbinds = state.links
		.filter(link => link.hotkey)
		.map(link =>
			hotkeys(link.hotkey!, () => window.location.assign(link.url)),
		)

	onDestroy(() => unbinds.forEach(unbind => unbind()))

	return el
}

export const name = "Link list"
