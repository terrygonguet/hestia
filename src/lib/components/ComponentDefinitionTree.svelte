<script lang="ts">
	import type { ComponentDefinition } from "$/types"
	import { builtins } from "$lib/builtins"
	import { createEventDispatcher } from "svelte"

	export let depth = 0
	export let definition: ComponentDefinition
	export let selected: string
	export let lastInList = false

	const emit = createEventDispatcher<{ select: string }>()

	$: builtinName =
		definition.type == "Custom" ? "Custom" : builtins[definition.type].name
	$: name = (definition.name || builtinName) ?? definition.type
	$: prefixStart = depth > 0 ? "│".repeat(depth - 1) : ""
	$: prefixSplit = lastInList ? "└" : "├"
	$: prefixEnd = definition.children?.length ? "┬" : "─"
	$: prefix = depth > 0 ? prefixStart + prefixSplit + prefixEnd : ""
	$: lastChild = definition.children?.at(-1)
</script>

<label class:selected={selected == definition.id}>
	<input
		type="radio"
		value={definition.id}
		name="component"
		on:change={() => emit("select", definition.id)}
	/>{prefix}{name}
</label>
{#each definition.children ?? [] as child}
	<svelte:self
		depth={depth + 1}
		definition={child}
		{selected}
		lastInList={child == lastChild && !child.children?.length}
		on:select
	/>
{/each}

<style>
	label {
		cursor: pointer;
		font-family: "Courier New", Courier, monospace;
		line-height: 1.1;
		font-size: 1.1rem;
	}
	input[type="radio"] {
		appearance: none;
		outline: none;
	}
	.selected {
		background-color: var(--color-accent, coral);
	}
</style>
