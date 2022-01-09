<script lang="ts">
	import type { Writable } from "svelte/store"

	export let depth = 0
	export let definition: ComponentDefinition
	export let selected: Writable<string>
</script>

<label style="--depth:{depth}" class:selected={$selected == definition.id}>
	<input
		type="radio"
		value={definition.id}
		name="component"
		on:change={() => ($selected = definition.id)}
	/>{definition.type}
</label>
{#each definition.children ?? [] as child}
	<svelte:self depth={depth + 1} definition={child} {selected} />
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
