export function initState() {
	return {}
}

const css = String.raw,
	html = String.raw
const styles = {
	wrapper: css`
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	`,
}

export async function render() {
	const el = document.createElement("div")
	el.setAttribute("style", styles.wrapper)
	el.innerHTML = html`<p>Todo: add some instructions</p>`

	return el
}

export const name = "Default display"
