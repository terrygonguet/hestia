import type { Context } from "$/types"
import EditIcon from "virtual:icons/ion/edit"

export function initState() {
	return {}
}

const html = String.raw

export async function render(_: never, { css, id }: Context) {
	const el = document.createElement("div")
	el.id = id
	el.innerHTML = html`<p>
		Click on the "<span id="icon"></span>" button on the top right to start
		adding components.
	</p>`
	css["#" + id] = `
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	`
	const span = el.querySelector("#icon")
	if (span) new EditIcon({ target: span })

	return el
}

export const name = "Default display"
