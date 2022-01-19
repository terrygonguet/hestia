<script lang="ts">
	import type { EditorFieldConfig } from "$/types"
	import ArrayField from "$lib/components/ArrayField.svelte"
	import { nanoid } from "nanoid"

	export let field: EditorFieldConfig
	export let value: any
	export let id = nanoid()
	export let hideLabel = false
</script>

{#if field.info}
	<div class="info">{@html field.info}</div>
{/if}

{#if !hideLabel}
	<label for="field-{id}">{field.label}</label>
{/if}

{#if field.type == "text"}
	<input
		id="field-{id}"
		type="text"
		placeholder={field.placeholder ?? ""}
		class:span3={!hideLabel}
		class:span4={hideLabel}
		bind:value
	/>
{:else if field.type == "select"}
	<select
		id="field-{id}"
		class:span3={!hideLabel}
		class:span4={hideLabel}
		bind:value
	>
		{#each field.options as { label, value }}
			<option {value}>{label}</option>
		{/each}
	</select>
{:else if field.type == "number"}
	<input
		id="field-{id}"
		type="number"
		class:span3={!hideLabel}
		class:span4={hideLabel}
		min={field.min}
		max={field.max}
		step={field.step}
		bind:value
	/>
{:else if field.type == "boolean"}
	<div class:span3={!hideLabel} class:span4={hideLabel}>
		<input id="field-{id}" type="checkbox" bind:checked={value} />
	</div>
{:else if field.type == "array"}
	<div class:span3={!hideLabel} class:span4={hideLabel} />
	<ArrayField {field} {id} bind:value />
{/if}

<style>
	.info {
		grid-column: span 4;
		font-size: 0.85rem;
		color: var(--color-textQuiet, #2a2a2a);
		padding-top: 0.5rem;
	}

	.span3 {
		grid-column: span 3;
	}

	.span4 {
		grid-column: span 4;
	}
</style>
