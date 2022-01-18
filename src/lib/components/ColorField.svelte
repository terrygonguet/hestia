<script lang="ts">
	import { nanoid } from "nanoid"

	export let label: string
	export let name = ""
	export let id = nanoid()
	export let value: string

	let input: HTMLInputElement

	function onClick() {
		input.click()
	}
</script>

<label for={id}>{label}</label>
<button
	tabindex="0"
	class="indicator"
	style="--color:{value}"
	on:click={onClick}
/>
<input type="text" {name} {id} bind:value />
<input type="color" bind:value bind:this={input} />

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

	input[type="color"] {
		display: none;
	}
</style>
