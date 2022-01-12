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
	el.innerHTML = html`<p>
		Click on the "✏" button on the top right to start adding components.
	</p>`

	return el
}

export const name = "Default display"
