<script lang="ts">
	import { DefaultDisplay } from "$lib/builtins"
	import ConfigWidget from "$lib/components/ConfigWidget.svelte"
	import GlobalStyles from "$lib/components/GlobalStyles.svelte"
	import { render as renderComponentTree } from "$lib/render"
	import { onDestroy, onMount } from "svelte"
	import browser from "webextension-polyfill"

	let container: HTMLDivElement
	let allowFade = false
	let onDestroyCallbacks: (() => void)[] = []

	onMount(async () => {
		const { root } = await browser.storage.local.get("root")
		onDestroyCallbacks.length = 0
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

<GlobalStyles />
<ConfigWidget current="home" {allowFade} />
<div id="container" bind:this={container} />

<style>
	#container {
		display: contents;
	}
</style>
