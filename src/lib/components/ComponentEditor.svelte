<script lang="ts">
	import type { Component, ComponentDefinition } from "$/types"
	import { persist } from "$/utils"
	import EditorField from "$lib/components/EditorField.svelte"
	import { afterUpdate, onMount, tick } from "svelte"
	import browser from "webextension-polyfill"

	export let component: Component
	export let selected: ComponentDefinition

	let editorValues = component.initState()
	let loading = true

	$: editorConfig = component.editorConfig ?? []
	$: save(editorValues)

	async function save(..._dependencies: any[]) {
		if (loading) return
		return persist({ [selected.id]: editorValues })
	}

	onMount(async () => {
		const data = await browser.storage.local.get(selected.id)
		editorValues = Object.assign(editorValues, data[selected.id])
		await tick()
		loading = false
	})

	afterUpdate(async () => {
		if (loading) return
		loading = true
		const data = await browser.storage.local.get(selected.id)
		editorValues = Object.assign(component.initState(), data[selected.id])
		await tick()
		loading = false
	})
</script>

<section on:change|stopPropagation>
	{#each editorConfig as field}
		{#if field.type == "info"}
			<p class="info">{@html field.html}</p>
		{:else if field.type == "divider"}
			<hr />
		{:else}
			<EditorField bind:value={editorValues[field.prop]} {field} />
		{/if}
	{:else}
		<p id="no-editorconfig">This component can't be edited.</p>
	{/each}
</section>

<style>
	section {
		display: grid;
		grid-template-columns: auto 1fr auto 1fr;
		grid-auto-rows: max-content;
		align-items: center;
		gap: 0.75rem;
	}

	hr {
		border-color: transparent;
		border-top-color: var(--color-borders, #000);
		margin: 0.75rem 0;
		grid-column: span 4;
	}

	.info {
		grid-column: span 4;
	}

	#no-editorconfig {
		grid-column: span 4;
		text-align: center;
		margin: 3rem;
	}
</style>
