<script lang="ts">
	import { onMount } from "svelte"
	import { nanoid } from "nanoid"
	import { render as renderComponentTree } from "./lib/render"
	import ConfigWidget from "./lib/components/ConfigWidget.svelte"

	let container: HTMLDivElement

	onMount(async () => {
		const { root } = await browser.storage.local.get("root")
		const el = await renderComponentTree(
			root ?? { id: nanoid(), type: "DefaultDisplay" },
		)
		container.appendChild(el)
	})
</script>

<ConfigWidget current="home" />
<div id="container" bind:this={container} />

<style>
	#container {
		display: contents;
	}
</style>
