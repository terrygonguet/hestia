<script context="module" lang="ts">
	export type InvalidState =
		| { type: "Empty" }
		| { type: "Loading" }
		| { type: "Error"; message: string }
	export type State = {
		root: ComponentDefinition
		selected: ComponentDefinition["id"]
	}
</script>

<script lang="ts">
	import type { ComponentDefinition } from "$/types"
	import { asyncMap } from "$/utils"
	import {
		addChild,
		deleteById,
		findById,
		findParentOfId,
		flatten,
	} from "$/utils/compdef"
	import { isSome } from "$/utils/maybe"
	import {
		isRight,
		Left,
		map as mapResult,
		Result,
		Right,
	} from "$/utils/result"
	import Components from "$lib/components/Components.svelte"
	import ConfigWidget from "$lib/components/ConfigWidget.svelte"
	import GlobalStyles from "$lib/components/GlobalStyles.svelte"
	import Properties from "$lib/components/Properties.svelte"
	import { nanoid } from "nanoid"
	import { onMount } from "svelte"
	import fsm from "svelte-fsm"
	import browser from "webextension-polyfill"

	const emptyState = Left<InvalidState, State>({ type: "Empty" })
	const machine = fsm("loading", {
		loading: {
			load(root?: ComponentDefinition, selected?: string) {
				if (root) {
					state = Right({ root, selected: selected || root.id })
					return "done"
				} else {
					state = emptyState
					return "empty"
				}
			},
			error(reason: string) {
				state = Left({ type: "Error", message: reason })
				return "error"
			},
		},
		empty: {
			create() {
				const id = nanoid()
				state = Right({
					root: { type: "Box", id },
					selected: id,
				})
				return "done"
			},
		},
		done: {
			select(id: string) {
				state = mapResult(state, ({ root }) => ({ root, selected: id }))
			},
			create() {
				state = mapResult(state, ({ root, selected }) => {
					const definition = findById(root, selected)
					if (isSome(definition))
						addChild(definition, { type: "Spacer", id: nanoid() })
					return { root, selected }
				})
			},
			async clone() {
				if (!isRight(state)) return
				const {
					value: { root, selected },
				} = state

				const definition = findById(root, selected)
				const parent = findParentOfId(root, selected)
				if (!definition || !parent || !parent.children?.length) return
				const i = parent.children.indexOf(definition)
				if (i == -1) return
				const cloneDef = await clone(definition)
				parent.children.splice(i + 1, 0, cloneDef)
				state = Right({ root, selected })
			},
			async remove() {
				if (!isRight(state)) return
				const {
					value: { root, selected },
				} = state

				if (
					root.id == selected &&
					confirm(
						"Are you sure you want to delete ALL of the components?",
					)
				) {
					const ids = flatten(root).map(c => c.id)
					await browser.storage.local.remove([
						"root",
						"selected",
						...ids,
					])
					state = emptyState
					return "empty"
				}

				const definition = findById(root, selected)
				if (
					isSome(definition) &&
					(!definition.children?.length ||
						confirm(
							"Are you sure you want to delete this component and all of its children?",
						))
				) {
					let parent = findParentOfId(root, selected)
					let definition = findById(root, selected)
					const ids = definition
						? flatten(definition).map(c => c.id)
						: []
					await browser.storage.local.remove(ids)
					deleteById(root, selected)
					state = Right({ root, selected: parent?.id ?? root.id })
					return
				}
			},
			moveUp() {
				if (!isRight(state)) return
				const {
					value: { root, selected },
				} = state
				const parent = findParentOfId(root, selected)
				if (!parent || !parent.children?.length) return
				const grandparent = findParentOfId(root, parent.id)
				if (!grandparent || !grandparent.children?.length) return
				const i = parent.children.findIndex(c => c.id == selected)
				const j = grandparent.children.indexOf(parent)
				if (i == -1 || j == -1) return
				const [definition] = parent.children.splice(i, 1)
				grandparent.children.splice(j + 1, 0, definition)
				state = Right({ root, selected })
			},
			moveDown() {
				if (!isRight(state)) return
				const {
					value: { root, selected },
				} = state
				const parent = findParentOfId(root, selected)
				if (!parent || !parent.children?.length) return
				const i = parent.children.findIndex(c => c.id == selected)
				if (i == -1) return
				const sibling = parent.children[i + 1] ?? parent.children[i - 1]
				if (!sibling) return
				const [definition] = parent.children.splice(i, 1)
				if (sibling.children) sibling.children.push(definition)
				else sibling.children = [definition]
				state = Right({ root, selected })
			},
			moveLeft() {
				if (!isRight(state)) return
				const {
					value: { root, selected },
				} = state
				const parent = findParentOfId(root, selected)
				if (
					!parent ||
					!parent.children?.length ||
					parent.children.length == 1
				)
					return
				const i = parent.children.findIndex(c => c.id == selected)
				if (i == -1 || i == 0) return
				const [definition] = parent.children.splice(i, 1)
				parent.children.splice(i - 1, 0, definition)
				state = Right({ root, selected })
			},
			moveRight() {
				if (!isRight(state)) return
				const {
					value: { root, selected },
				} = state
				const parent = findParentOfId(root, selected)
				if (
					!parent ||
					!parent.children?.length ||
					parent.children.length == 1
				)
					return
				const i = parent.children.findIndex(c => c.id == selected)
				if (i == -1 || i == parent.children.length - 1) return
				const [definition] = parent.children.splice(i, 1)
				parent.children.splice(i + 1, 0, definition)
				state = Right({ root, selected })
			},
		},
		error: {},
	})

	let state: Result<InvalidState, State> = Left({ type: "Loading" })
	$: save(state)

	async function save(..._dependencies: any[]) {
		if (!isRight(state)) return
		const {
			value: { root, selected },
		} = state
		return browser.storage.local.set({ root, selected })
	}

	async function clone(
		definition: ComponentDefinition,
	): Promise<ComponentDefinition> {
		const { [definition.id]: data } = await browser.storage.local.get(
			definition.id,
		)
		const cloneData = JSON.parse(JSON.stringify(data ?? {}))
		const id = nanoid()
		await browser.storage.local.set({ [id]: cloneData })
		const children =
			definition.children && (await asyncMap(definition.children, clone))
		return { ...definition, id, children }
	}

	onMount(async () => {
		try {
			const { root, selected } = await browser.storage.local.get([
				"root",
				"selected",
			])
			machine.load(root, selected)
		} catch (err) {
			console.error(err)
			if (err instanceof Error) machine.error(err.message)
			else machine.error("An unknown error happened.")
		}
	})
</script>

<GlobalStyles />
<ConfigWidget current="edit" />
<main id="container">
	<Components
		{state}
		on:select={e => machine.select(e.detail)}
		on:create={machine.create}
		on:clone={machine.clone}
		on:remove={machine.remove}
		on:moveup={machine.moveUp}
		on:movedown={machine.moveDown}
		on:moveleft={machine.moveLeft}
		on:moveright={machine.moveRight}
	/>
	{#if isRight(state)}
		<Properties state={state.value} on:change={() => (state = state)} />
	{:else}
		<fieldset>
			<legend>ℹ</legend>
		</fieldset>
	{/if}
</main>

<style>
	#container {
		display: grid;
		height: 100%;
		padding: 1rem;
		grid-template-columns: 1fr 3fr;
		background-color: var(--color-background, #fff);
		color: var(--color-text, #000);
	}

	fieldset {
		display: grid;
		place-items: center;
		height: 100%;
	}
</style>
