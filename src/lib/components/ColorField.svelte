<script lang="ts">
	import { nanoid } from "nanoid"

	export let label: string
	export let name = ""
	export let id = nanoid()
	export let value: string
	export let editableName = false

	let colorInput: HTMLInputElement

	function onClick() {
		colorInput.click()
	}
</script>

{#if editableName}
	<input type="text" bind:value={label} placeholder="Name" on:change />
{:else}
	<label for={id}>{label}</label>
{/if}
<button
	tabindex="0"
	class="indicator"
	style="--color:{value}"
	on:click={onClick}
/>
<input type="text" {name} {id} bind:value on:change />
<input type="color" bind:value bind:this={colorInput} />

<style>
	.indicator {
		width: 7rem;
		align-self: stretch;
		background-color: white;
		position: relative;
		border: 1px solid black;
		cursor: pointer;
	}
	.indicator::after {
		content: "";
		position: absolute;
		inset: 1px;
		background-color: var(--color, #000000);
	}

	input[type="text"] {
		max-width: 16ch;
	}

	input[type="color"] {
		display: none;
	}
</style>
