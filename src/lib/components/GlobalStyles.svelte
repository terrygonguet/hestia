<script lang="ts">
	import { nanoid } from "nanoid"
	import { onMount } from "svelte"
	import browser from "webextension-polyfill"
	import { baseConfig } from "src/Options.svelte"

	const id = nanoid()

	let config = baseConfig

	$: baseColors = config.baseColors
	$: baseColorsProps = Object.entries(baseColors)
		.map(([name, value]) => `--color-${name}: ${value};`)
		.join("")
	$: css = `:root { ${baseColorsProps} }`
	$: updateStyle(css)

	function updateStyle(..._dependencies: any[]) {
		const styleEl = document.getElementById(id)
		if (styleEl) styleEl.innerHTML = css
	}

	function onStorageChange(
		changes: { [key: string]: browser.Storage.StorageChange },
		areaName: string,
	) {
		if (areaName != "local") return
		config = Object.assign(config, changes.config.newValue)
	}

	onMount(async () => {
		const stored = await browser.storage.local.get("config")
		config = Object.assign(config, stored.config)
		browser.storage.onChanged.addListener(onStorageChange)

		const styleEl = document.createElement("style")
		styleEl.id = id
		document.head.appendChild(styleEl)

		return () => {
			styleEl.remove()
			browser.storage.onChanged.removeListener(onStorageChange)
		}
	})
</script>
