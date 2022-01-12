<script lang="ts">
	import { onMount } from "svelte"
	import { render as renderComponentTree } from "./lib/render"
	import ConfigWidget from "./lib/components/ConfigWidget.svelte"
	import { DefaultDisplay } from "./lib/builtins"

	let container: HTMLDivElement
	let allowFade = false

	onMount(async () => {
		const { root } = await browser.storage.local.get("root")
		const el = await (root
			? renderComponentTree(root)
			: DefaultDisplay.render())
		allowFade = !!root
		container.appendChild(el)
	})
</script>

<ConfigWidget current="home" {allowFade} />
<div id="container" bind:this={container} />

<style>
	#container {
		display: contents;
	}
</style>
