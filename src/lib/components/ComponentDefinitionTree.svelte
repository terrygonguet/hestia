<script lang="ts">
	import type { ComponentDefinition } from "src/types"
	import { createEventDispatcher } from "svelte"
	import { builtins } from "../builtins"

	export let depth = 0
	export let definition: ComponentDefinition
	export let selected: string

	const emit = createEventDispatcher<{ select: string }>()

	$: builtinName =
		definition.type == "Custom" ? "Custom" : builtins[definition.type].name
	$: name = (definition.name || builtinName) ?? definition.type
</script>

<label style="--depth:{depth}" class:selected={selected == definition.id}>
	<input
		type="radio"
		value={definition.id}
		name="component"
		on:change={() => emit("select", definition.id)}
	/>{name}
</label>
{#each definition.children ?? [] as child}
	<svelte:self depth={depth + 1} definition={child} {selected} on:select />
{/each}

<style>
	label {
		padding-left: calc(var(--depth, 0) * 0.7rem);
		cursor: pointer;
	}
	input[type="radio"] {
		appearance: none;
		outline: none;
	}
	.selected {
		background-color: coral;
	}
</style>
