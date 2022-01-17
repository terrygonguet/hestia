<script lang="ts">
	import { nanoid } from "nanoid"
	import type { ArrayEditorFieldConfig } from "../../types"
	import EditorField from "./EditorField.svelte"

	export let field: ArrayEditorFieldConfig
	export let id = nanoid()
	export let value: any[] = []

	function add() {
		if (Array.isArray(field.subfields)) {
			const obj: { [prop: string]: any } = {}
			for (const subfield of field.subfields) {
				switch (subfield.type) {
					case "text":
						obj[subfield.prop] = ""
						break
					case "boolean":
						obj[subfield.prop] = false
						break
					case "number":
						obj[subfield.prop] = 0
						break
					case "select":
						obj[subfield.prop] = subfield.options[0].value
						break
					default:
						throw new Error("Not implemented yet")
				}
			}
			value = [...value, obj]
		} else {
			switch (field.subfields.type) {
				case "text":
					value = [...value, ""]
					break
				case "boolean":
					value = [...value, false]
					break
				case "number":
					value = [...value, 0]
					break
				case "select":
					value = [...value, field.subfields.options[0].value]
					break
				default:
					throw new Error("Not implemented yet")
			}
		}
	}

	function remove(i: number) {
		return function () {
			value.splice(i, 1)
			value = value
		}
	}
</script>

<div id="container">
	{#each value as item, i}
		<div class="group">
			{#if Array.isArray(field.subfields)}
				{#each field.subfields as subfield, j}
					<EditorField
						id="{id}-{i}-{subfield.prop}"
						field={subfield}
						bind:value={item[subfield.prop]}
					/>
				{/each}
				<button
					class="remove"
					style="--height:{field.subfields.length}"
					on:click={remove(i)}>❌</button
				>
			{:else}
				<EditorField
					id="{id}-{i}"
					field={field.subfields}
					hideLabel={true}
					bind:value={value[i]}
				/>
				<button class="remove" on:click={remove(i)}>❌</button>
			{/if}
		</div>
	{/each}
	<button id="add" on:click={add}>➕</button>
</div>

<style>
	#container {
		grid-column: 2 / span 3;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.group {
		display: grid;
		grid-template-columns: auto repeat(3, 1fr) auto;
		gap: 0.5rem;
		align-items: center;
	}

	.remove {
		grid-column: -2 / -1;
		grid-row: 1 / span var(--height, 1);
		align-self: stretch;
	}

	#add {
		grid-column: span 5;
	}
</style>
