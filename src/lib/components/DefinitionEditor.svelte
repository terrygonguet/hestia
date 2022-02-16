<script lang="ts">
	import type { ComponentDefinition } from "$/types"
	import { builtins } from "$lib/builtins"

	const availableComponents = {
		...builtins,
		Custom: { name: "Custom" },
	}

	export let selected: ComponentDefinition

	$: placeholder = selected
		? availableComponents[selected.type].name
		: "Unknown component"

	type Entry = [ComponentDefinition["type"], { name: string }]
	$: entries = Object.entries(availableComponents) as Entry[]

	function isTypeDisabled(type: ComponentDefinition["type"]) {
		return import.meta.env.ENV_BROWSER == "chrome" && type == "Custom"
	}
</script>

<section>
	<p id="id">ID: {selected.id}</p>
	<label for="ddl-type"> Type: </label>
	<select id="ddl-type" name="type" bind:value={selected.type}>
		{#each entries as [type, { name }]}
			<option value={type} disabled={isTypeDisabled(type)}>{name}</option>
		{/each}
	</select>
	<label for="txb-name"> Name: </label>
	<input
		id="txb-name"
		type="text"
		name="name"
		bind:value={selected.name}
		{placeholder}
	/>
	{#if selected.type == "Custom"}
		<label for="txb-url">URL:</label>
		<input
			type="url"
			name="url"
			id="txb-url"
			bind:value={selected.url}
			style="grid-column: span 3"
		/>
		<p id="custom-warning">
			Custom components execute untrusted code with special extension
			capabilities, we highly recommend that you read thoroughly any
			component code that you want to use.
		</p>
	{/if}
</section>

<style>
	section {
		display: grid;
		grid-template-columns: auto 1fr auto 1fr;
		grid-auto-rows: max-content;
		align-items: center;
		gap: 0.75rem;
	}

	#id {
		color: #a0a0a0;
		grid-column: span 4;
		font-size: 0.75rem;
		text-align: right;
	}

	#custom-warning {
		grid-column: span 4;
		color: var(--color-accent, red);
		font-size: 1.3rem;
		font-weight: bold;
		text-align: center;
		margin-top: 1rem;
	}
</style>
