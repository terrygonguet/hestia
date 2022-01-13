<script lang="ts">
	import { nanoid } from "nanoid"
	import type { EditorFieldConfig } from "src/types"

	export let field: EditorFieldConfig
	export let value: any

	const id = nanoid()
</script>

{#if field.info}
	<div class="info">{@html field.info}</div>
{/if}
<label for="field-{id}">{field.label}</label>
{#if field.type == "text"}
	<input id="field-{id}" type="text" style="grid-column: span 3" bind:value />
{:else if field.type == "select"}
	<select id="field-{id}" style="grid-column: span 3" bind:value>
		{#each field.options as { label, value }}
			<option {value}>{label}</option>
		{/each}
	</select>
{:else if field.type == "number"}
	<input
		id="field-{id}"
		type="number"
		style="grid-column: span 3"
		min={field.min}
		max={field.max}
		step={field.step}
		bind:value
	/>
{:else if field.type == "boolean"}
	<div style="grid-column: span 3">
		<input id="field-{id}" type="checkbox" bind:checked={value} />
	</div>
{/if}

<style>
	.info {
		grid-column: span 4;
		font-size: 0.85rem;
		color: #2a2a2a;
		padding-top: 0.5rem;
	}
</style>
