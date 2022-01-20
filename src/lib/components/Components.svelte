<script lang="ts">
	import type { InvalidState, State } from "$/Edit.svelte"
	import { isLeft, Result } from "$/utils/result"
	import ComponentDefinitionTree2 from "$lib/components/ComponentDefinitionTree.svelte"
	import { createEventDispatcher } from "svelte"
	import IconArrowLeft from "virtual:icons/ion/arrow-back-sharp"
	import IconArrowDown from "virtual:icons/ion/arrow-down-b"
	import IconArrowRight from "virtual:icons/ion/arrow-forward-sharp"
	import IconArrowUp from "virtual:icons/ion/arrow-up-b"
	import IconDuplicate from "virtual:icons/ion/duplicate-sharp"
	import IconAdd from "virtual:icons/ion/md-add"
	import IconRemove from "virtual:icons/ion/trash-sharp"

	export let state: Result<InvalidState, State>

	const iconProps = {
		width: "1.5rem",
		height: "1.5rem",
	}

	const emit = createEventDispatcher()
</script>

<form on:submit|preventDefault>
	<fieldset>
		<legend>Components</legend>
		{#if isLeft(state)}
			{#if state.value.type == "Empty"}
				<p class="centered">
					Start creating components by clicking the "<IconAdd
						width="1.5rem"
						height="1.5rem"
					/>" button below.
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
			on:click={() => emit("create")}><IconAdd {...iconProps} /></button
		>
		<button
			type="button"
			title="Delete selected component"
			on:click={() => emit("remove")}
			><IconRemove {...iconProps} /></button
		>
		<button
			type="button"
			title="Clone selected component"
			on:click={() => emit("clone")}
			><IconDuplicate {...iconProps} /></button
		>
		<button
			type="button"
			title="Move selected up the hierachy"
			on:click={() => emit("moveup")}
			><IconArrowLeft {...iconProps} /></button
		>
		<button
			type="button"
			title="Move selected down the hierarchy"
			on:click={() => emit("movedown")}
			><IconArrowRight {...iconProps} /></button
		>
		<button
			type="button"
			title="Move selected up"
			on:click={() => emit("moveleft")}
			><IconArrowUp {...iconProps} /></button
		>
		<button
			type="button"
			title="Move seleted down"
			on:click={() => emit("moveright")}
			><IconArrowDown {...iconProps} /></button
		>
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}
	fieldset {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
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
