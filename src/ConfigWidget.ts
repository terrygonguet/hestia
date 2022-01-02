import "./configWidget.css"

export function setupConfigWidget() {
	const wrapper = document.createElement("aside")
	wrapper.setAttribute("id", "config-wrapper")

	const edit = document.createElement("a")
	edit.setAttribute("href", "/edit.html")
	edit.classList.add("config-button")
	edit.setAttribute("title", "edit")
	edit.innerText = "✏"

	const config = document.createElement("a")
	config.classList.add("config-button")
	config.setAttribute("title", "config")
	config.innerText = "⚙"

	wrapper.appendChild(edit)
	wrapper.appendChild(config)

	document.body.appendChild(wrapper)
}
