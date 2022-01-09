<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import fsm from "svelte-fsm"
	import ComponentDefinitionTree from "./lib/components/ComponentDefinitionTree.svelte"
	import ConfigWidget from "./lib/components/ConfigWidget.svelte"
	import { addChild, deleteById, findById } from "./utils/compdef"
	import { nanoid } from "nanoid"

	const selected = writable<string>()
	const state = fsm("loading", {
		loading: {
			complete(root: ComponentDefinition) {
				definition = root
				$selected = definition.id
				return "done"
			},
			error(err: Error) {
				console.error(err)
				error = err
				return "error"
			},
			empty: "empty",
		},
		empty: {
			add() {
				definition = { id: nanoid(), type: "TestDiv" }
				$selected = definition.id
				save()
				return "done"
			},
		},
		done: {
			add() {
				if (selectedDef) {
					addChild(selectedDef, {
						id: nanoid(),
						type: "TestDiv",
					})
					save()
					definition = definition // force svelte refresh
				}
			},
			remove() {
				if (
					selectedDef == definition &&
					confirm(
						"Are you sure you want to delete ALL of the components?",
					)
				) {
					clear()
					return "empty"
				} else if (
					selectedDef &&
					confirm(
						"Are you sure you want to delete this component and all of its children?",
					)
				) {
					deleteById(definition, $selected)
					save()
					definition = definition // force svelte refresh
				}
			},
		},
		error: {},
	})

	let definition: ComponentDefinition
	let error: Error

	$: selectedDef = definition && findById(definition, $selected)
	$: console.log(selectedDef)

	function onClickAdd() {
		state.add()
	}

	function onClickRemove() {
		state.remove()
	}

	function save() {
		return browser.storage.local.set({ root: definition })
	}

	function clear() {
		return browser.storage.local.remove("root")
	}

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

<ConfigWidget current="edit" />
<div id="container">
	<form name="tree" id="tree" on:submit|preventDefault>
		<fieldset id="components">
			<legend>Components</legend>
			{#if $state == "loading"}
				<p class="centered">Loading...</p>
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
				on:click={onClickAdd}>+</button
			>
			<button
				type="button"
				title="Delete component"
				on:click={onClickRemove}>-</button
			>
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
