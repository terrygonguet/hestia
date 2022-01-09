<script lang="ts">
	import { onMount } from "svelte"
	import { writable } from "svelte/store"
	import fsm from "svelte-fsm"
	import ComponentDefinitionTree from "./lib/components/ComponentDefinitionTree.svelte"
	import ConfigWidget from "./lib/components/ConfigWidget.svelte"
	import {
		addChild,
		deleteById,
		findById,
		findParentOfId,
	} from "./utils/compdef"
	import { nanoid } from "nanoid"
	import { builtins } from "./lib/builtins"

	const availableComponents = {
		...builtins,
		Custom: { name: "Custom" },
	}
	const selected = writable<string>()
	const state = fsm("loading", {
		loading: {
			complete(stored: ComponentDefinition) {
				root = stored
				$selected = root.id
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
				root = { id: nanoid(), type: "TestDiv" }
				$selected = root.id
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
					root = root // force svelte refresh
				}
			},
			remove() {
				if (
					selectedDef == root &&
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
					let parent = findParentOfId(root, $selected)
					deleteById(root, $selected)
					if (parent) $selected = parent.id
					save()
					root = root // force svelte refresh
				}
			},
		},
		error: {},
	})

	let root: ComponentDefinition
	let error: Error

	let editorValues: { [prop: string]: any } = {}

	$: selectedDef = root && findById(root, $selected)
	$: selectedType = selectedDef?.type ?? "none"
	$: updateEditor($selected, selectedType)
	$: selectedComponent = (selectedDef &&
		(availableComponents as any)[selectedDef.type]) as Component | undefined
	$: placeholder = selectedComponent?.name ?? ""

	function save() {
		return browser.storage.local.set({
			root,
			[selectedDef?.id ?? ""]: editorValues,
		})
	}

	function clear() {
		return browser.storage.local.remove("root")
	}

	async function updateEditor(...dependencies: any[]) {
		if (!selectedDef) return
		const stored = await browser.storage.local.get(selectedDef.id)
		const defaultValues = selectedComponent?.initState() ?? {}
		editorValues = Object.assign(
			defaultValues,
			stored[selectedDef.id] ?? {},
		)
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
				<ComponentDefinitionTree definition={root} {selected} />
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
				on:click={state.add}>+</button
			>
			<button
				type="button"
				title="Delete component"
				on:click={state.remove}>-</button
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
	<form id="props" on:submit|preventDefault on:change={save}>
		<fieldset>
			<legend>Properties</legend>
			{#if $state == "done" && selectedDef}
				<p id="id">ID: {selectedDef.id}</p>
				<label for="ddl-type"> Type: </label>
				<select id="ddl-type" name="type" bind:value={selectedDef.type}>
					{#each Object.entries(availableComponents) as [type, { name }]}
						<option value={type}>{name}</option>
					{/each}
				</select>
				<label for="txb-name"> Name: </label>
				<input
					id="txb-name"
					type="text"
					name="name"
					bind:value={selectedDef.name}
					{placeholder}
				/>
				{#if selectedDef.type == "Custom"}
					<label for="txb-url">URL:</label>
					<input
						type="url"
						name="url"
						id="txb-url"
						bind:value={selectedDef.url}
						style="grid-column: span 3"
					/>
				{/if}
				<hr style="grid-column: span 4" />
				{#each selectedComponent?.editorConfig ?? [] as field, i}
					<label for="field-{i}">{field.label}</label>
					{#if field.type == "text"}
						<input
							id="field-{i}"
							type="text"
							style="grid-column: span 3"
							bind:value={editorValues[field.prop]}
						/>
					{:else if field.type == "select"}
						<select
							id="field-{i}"
							style="grid-column: span 3"
							bind:value={editorValues[field.prop]}
						>
							{#each field.options as { label, value }}
								<option {value}>{label}</option>
							{/each}
						</select>
					{:else if field.type == "number"}
						<input
							id="field-{i}"
							type="number"
							style="grid-column: span 3"
							min={field.min}
							max={field.max}
							step={field.step}
							bind:value={editorValues[field.prop]}
						/>
					{:else if field.type == "boolean"}
						<div style="grid-column: span 3">
							<input
								id="field-{i}"
								type="checkbox"
								bind:checked={editorValues[field.prop]}
							/>
						</div>
					{/if}
				{:else}
					<p id="no-editorconfig">This component can't be edited.</p>
				{/each}
			{/if}
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
		display: grid;
		grid-template-columns: auto 1fr auto 1fr;
		grid-auto-rows: max-content;
		align-items: center;
		gap: 0.75rem;
		height: 100%;
	}
	#id {
		color: #a0a0a0;
		grid-column: span 4;
		font-size: 0.75rem;
		text-align: right;
	}
	hr {
		border-color: transparent;
		border-top-color: #a0a0a0;
		margin-right: 0;
		margin-left: 0;
	}
	#no-editorconfig {
		grid-column: span 4;
		text-align: center;
	}
</style>
