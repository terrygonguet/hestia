<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import type { InvalidState, State } from "../../Edit.svelte"
	import { isLeft, Result } from "../../utils/result"
	import ComponentDefinitionTree2 from "./ComponentDefinitionTree.svelte"

	export let state: Result<InvalidState, State>

	const emit = createEventDispatcher()
</script>

<form on:submit|preventDefault>
	<fieldset>
		<legend>Components</legend>
		{#if isLeft(state)}
			{#if state.value.type == "Empty"}
				<p class="centered">
					Start creating components by clicking the "➕" button below.
				</p>
			{:else if state.value.type == "Loading"}
				<p class="centered">Loading...</p>
			{:else if state.value.type == "Error"}
				<p class="centered error">{state.value.message}</p>
			{/if}
		{:else}
			<ComponentDefinitionTree2
				definition={state.value.root}
				selected={state.value.selected}
				on:select
			/>
		{/if}
	</fieldset>
	<div id="commands">
		<button
			type="button"
			title="Create component and add as child of selected"
			on:click={() => emit("create")}>➕</button
		>
		<button
			type="button"
			title="Delete selected component"
			on:click={() => emit("remove")}>➖</button
		>
		<button
			type="button"
			title="Clone selected component"
			on:click={() => emit("clone")}>🔂</button
		>
		<button
			type="button"
			title="Move selected up the hierachy"
			on:click={() => emit("moveup")}>⏮️</button
		>
		<button
			type="button"
			title="Move selected down the hierarchy"
			on:click={() => emit("movedown")}>⏭️</button
		>
		<button
			type="button"
			title="Move selected up"
			on:click={() => emit("moveleft")}>🔼</button
		>
		<button
			type="button"
			title="Move seleted down"
			on:click={() => emit("moveright")}>🔽</button
		>
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
	}
	fieldset {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	#commands {
		display: flex;
		padding: 0.25rem 3px 2px 2px;
		gap: 0.3rem;
	}
	#commands > button {
		flex-grow: 1;
		border: none;
	}

	.centered {
		text-align: center;
		margin: auto 1rem;
	}
	.error {
		color: red;
	}
</style>
