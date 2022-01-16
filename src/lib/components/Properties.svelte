<script lang="ts">
	import type { State } from "../../Edit.svelte"
	import type { ComponentDefinition } from "../../types"
	import { getCustomComponent } from "../../utils"
	import { findById } from "../../utils/compdef"
	import { isSome } from "../../utils/maybe"
	import { builtins } from "../builtins"
	import ComponentEditor from "./ComponentEditor.svelte"
	import DefinitionEditor from "./DefinitionEditor.svelte"

	export let state: State

	$: root = state.root
	$: selected = findById(root, state.selected)

	async function getComponent(selected: ComponentDefinition) {
		if (selected.type == "Custom") return getCustomComponent(selected.url)
		else return builtins[selected.type]
	}
</script>

<form on:submit|preventDefault on:change>
	<fieldset>
		<legend>Properties</legend>
		{#if isSome(selected)}
			<DefinitionEditor {selected} />
			<hr class="separator" />
			{#await getComponent(selected)}
				<p>Loading editor...</p>
			{:then component}
				<ComponentEditor {component} {selected} />
			{:catch error}
				<p>An error happened</p>
			{/await}
		{/if}
	</fieldset>
</form>

<style>
	form > fieldset {
		height: 100%;
	}

	hr {
		border-color: transparent;
		border-top-color: #a0a0a0;
		margin: 0.75rem 0;
		grid-column: span 4;
	}

	.separator {
		margin: 2rem 0;
	}
</style>
