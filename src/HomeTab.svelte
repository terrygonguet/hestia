<script lang="ts">
	import { onDestroy, onMount } from "svelte"
	import { render as renderComponentTree } from "./lib/render"
	import ConfigWidget from "./lib/components/ConfigWidget.svelte"
	import { DefaultDisplay } from "./lib/builtins"

	let container: HTMLDivElement
	let allowFade = false
	let onDestroyCallbacks: (() => void)[] = []

	onMount(async () => {
		const { root } = await browser.storage.local.get("root")
		if (root) {
			allowFade = true
			const { el, onDestroy } = await renderComponentTree(root)
			container.appendChild(el)
			onDestroyCallbacks.push(...onDestroy)
		} else {
			container.appendChild(await DefaultDisplay.render())
		}
	})

	onDestroy(() => onDestroyCallbacks.forEach(f => f()))
</script>

<ConfigWidget current="home" {allowFade} />
<div id="container" bind:this={container} />

<style>
	#container {
		display: contents;
	}
</style>
