<script lang="ts">
	import type { State } from "$/Edit.svelte"
	import type { ComponentDefinition } from "$/types"
	import { getCustomComponent } from "$/utils"
	import { findById } from "$/utils/compdef"
	import { isSome } from "$/utils/maybe"
	import { builtins } from "$lib/builtins"
	import ComponentEditor from "$lib/components/ComponentEditor.svelte"
	import DefinitionEditor from "$lib/components/DefinitionEditor.svelte"

	export let state: State

	$: root = state.root
	$: selected = findById(root, state.selected)
</script>

<form on:submit|preventDefault on:change>
	<fieldset>
		<legend>Properties</legend>
		{#if isSome(selected)}
			<DefinitionEditor {selected} />
			<hr class="separator" />
			{#if selected.type == "Custom"}
				{#await getCustomComponent(selected.url)}
					<p class="centered">Loading editor...</p>
				{:then component}
					<ComponentEditor {component} {selected} />
				{:catch error}
					<p class="centered">
						{error.message ?? "An error happened"}
					</p>
				{/await}
			{:else}
				<ComponentEditor
					component={builtins[selected.type]}
					{selected}
				/>
			{/if}
		{/if}
	</fieldset>
</form>

<style>
	form {
		min-height: 0;
	}

	form > fieldset {
		height: 100%;
		overflow-y: auto;
	}

	hr {
		border-color: transparent;
		border-top-color: var(--color-borders, #000);
		margin: 0.75rem 0;
		grid-column: span 4;
	}

	.separator {
		margin: 2rem 0;
	}

	.centered {
		text-align: center;
		padding: 3rem;
	}
</style>
