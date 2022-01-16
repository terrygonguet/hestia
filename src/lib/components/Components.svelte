<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import type { State } from "../../Edit.svelte"
	import { isLeft, Result } from "../../utils/result"
	import ComponentDefinitionTree2 from "./ComponentDefinitionTree.svelte"

	export let state: Result<string, State>

	const emit = createEventDispatcher()
</script>

<form on:submit|preventDefault>
	<fieldset>
		<legend>Components</legend>
		{#if isLeft(state)}
			<p class="centered">{state.value}</p>
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
			on:click={() => emit("create")}>+</button
		>
		<button
			type="button"
			title="Delete selected component"
			on:click={() => emit("remove")}>-</button
		>
		<button
			type="button"
			title="Move selected up the hierachy"
			on:click={() => emit("moveup")}>⇤</button
		>
		<button
			type="button"
			title="Move selected down the hierarchy"
			on:click={() => emit("movedown")}>⇥</button
		>
		<button
			type="button"
			title="Move selected up"
			on:click={() => emit("moveleft")}>⇧</button
		>
		<button
			type="button"
			title="Move seleted down"
			on:click={() => emit("moveright")}>⇩</button
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
		padding: 0.3rem;
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
</style>
