<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import fsm from "svelte-fsm"
	import ComponentDefinitionTree from "./lib/components/ComponentDefinitionTree.svelte"
	import ConfigWidget from "./lib/components/ConfigWidget.svelte"

	const selected = writable<string>()
	const state = fsm("loading", {
		loading: {
			complete(root: ComponentDefinition) {
				definition = root
				return "done"
			},
			error(err: Error) {
				console.error(err)
				error = err
				return "error"
			},
			empty: "empty",
		},
		empty: {},
		done: {},
		error: {},
	})

	let definition: ComponentDefinition
	let error: Error

	onMount(async () => {
		try {
			const { root } = await browser.storage.local.get("root")
			if (root) state.complete(root)
			else state.empty()
		} catch (error) {
			if (error instanceof Error) state.error(error)
			else {
				console.error(error)
				state.error(new Error("An unknown error happened"))
			}
		}
	})
</script>

<ConfigWidget />
<div id="container">
	<form name="tree" id="tree" on:submit|preventDefault>
		<fieldset id="components">
			<legend>Components</legend>
			{#if $state == "loading"}
				<p>Loading...</p>
			{:else if $state == "done"}
				<ComponentDefinitionTree {definition} {selected} />
			{:else if $state == "empty"}
				<p class="centered">
					You have no components yet, click the "+" button to add one!
				</p>
			{:else if $state == "error"}
				<p class="error centered">{error.message}</p>
			{/if}
		</fieldset>
		<div id="tree-commands">
			<button
				type="button"
				title="Create component and add as child of selected"
			>
				+
			</button>
			<button type="button" title="Delete component"> - </button>
			<button type="button" title="Make sibling of parent of selected">
				⇤
			</button>
			<button
				type="button"
				title="Make child of next sibling of selected"
			>
				⇥
			</button>
			<button type="button" title="Move selected up">⇧</button>
			<button type="button" title="Move seleted down">⇩</button>
		</div>
	</form>
	<form id="props" on:submit|preventDefault>
		<fieldset>
			<legend>Properties</legend>
		</fieldset>
	</form>
</div>

<style>
	#container {
		display: grid;
		height: 100%;
		padding: 1rem;
		grid-template-columns: 1fr 3fr;
	}

	.error {
		color: red;
	}
	.centered {
		text-align: center;
		margin: auto 1rem;
	}

	#tree {
		display: flex;
		flex-direction: column;
	}
	#components {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	#tree-commands {
		display: flex;
		padding: 0.3rem;
		gap: 0.3rem;
	}
	#tree-commands > button {
		flex-grow: 1;
		border: none;
	}

	#props > fieldset {
		height: 100%;
	}
</style>
