import type { Context, EditorConfig } from "src/types"

type DateStyle = "full" | "long" | "medium" | "short" | "none"
type TimeStyle = "full" | "long" | "medium" | "short" | "none"

export function initState() {
	return {
		locale: "",
		text: "%s",
		dateStyle: "full" as DateStyle,
		timeStyle: "full" as TimeStyle,
		center: true,
		size: 1,
	}
}

export const editorConfig: EditorConfig = [
	{
		type: "text",
		prop: "locale",
		label: "Locale:",
		info: "The ISO name of the locale to use. Leave blank to use the browser's default locale.",
	},
	{
		type: "text",
		prop: "text",
		label: "Text:",
		info: "<code>%s</code> will be replaced by the current date and time.",
	},
	{
		type: "select",
		prop: "dateStyle",
		label: "Date:",
		options: [
			{ label: "Full", value: "full" },
			{ label: "Long", value: "long" },
			{ label: "Medium", value: "medium" },
			{ label: "Short", value: "short" },
			{ label: "Hide", value: "none" },
		],
	},
	{
		type: "select",
		prop: "timeStyle",
		label: "Time:",
		options: [
			{ label: "Full", value: "full" },
			{ label: "Long", value: "long" },
			{ label: "Medium", value: "medium" },
			{ label: "Short", value: "short" },
			{ label: "Hide", value: "none" },
		],
	},
	{ type: "boolean", prop: "center", label: "Centered:" },
	{ type: "number", prop: "size", label: "Text size:", min: 0.1, step: 0.1 },
]

const css = String.raw
const style = css`
	display: flex;
`

export async function render(
	state: ReturnType<typeof initState>,
	{ onDestroy }: Context,
) {
	const DTFormatOptions: Intl.DateTimeFormatOptions = {}
	if (state.dateStyle != "none") DTFormatOptions.dateStyle = state.dateStyle
	if (state.timeStyle != "none") DTFormatOptions.timeStyle = state.timeStyle
	const formatter = new Intl.DateTimeFormat(
		state.locale || [],
		DTFormatOptions,
	)

	const el = document.createElement("div")
	el.setAttribute("style", style)
	el.innerText = state.text.replace("%s", formatter.format(new Date()))
	if (state.center) {
		el.style.justifyContent = "center"
		el.style.alignItems = "center"
	}
	el.style.fontSize = state.size + "rem"

	const id = setInterval(() => {
		const inner = state.text.replace("%s", formatter.format(new Date()))
		el.innerText = inner
	})
	onDestroy(() => clearInterval(id))

	return el
}

export const name = "Time"
