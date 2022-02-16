<script lang="ts">
	import ConfigWidget from "$lib/components/ConfigWidget.svelte"
	import GlobalStyles from "$lib/components/GlobalStyles.svelte"
	import { render as renderComponentTree } from "$lib/render"
	import { onDestroy, onMount } from "svelte"
	import browser from "webextension-polyfill"
	import EditIcon from "virtual:icons/ion/edit"

	let container: HTMLDivElement
	let allowFade = false
	let onDestroyCallbacks: (() => void)[] = []
	let showDefaultDisplay = false

	onMount(async () => {
		const { root } = await browser.storage.local.get("root")
		onDestroyCallbacks.length = 0
		if (root) {
			allowFade = true
			const { el, onDestroy } = await renderComponentTree(root)
			container.appendChild(el)
			onDestroyCallbacks.push(...onDestroy)
		} else {
			showDefaultDisplay = true
		}
	})

	onDestroy(() => onDestroyCallbacks.forEach(f => f()))
</script>

<GlobalStyles />
<ConfigWidget current="home" {allowFade} />
{#if showDefaultDisplay}
	<div id="default">
		<p>
			Click on the "<EditIcon />" button on the top right to start adding
			components.
		</p>
	</div>
{:else}
	<div id="container" bind:this={container} />
{/if}

<style>
	#container {
		display: contents;
	}
	#default {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}
</style>
