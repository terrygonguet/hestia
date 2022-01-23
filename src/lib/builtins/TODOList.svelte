<script lang="ts">
	import type { TODO } from "$lib/builtins/TODOList"
	import partition from "just-partition"
	import { createEventDispatcher } from "svelte"
	import Icontrash from "virtual:icons/ion/trash-sharp"

	export let todos: TODO[]
	export let title = ""
	export let radius = "0"

	const emit = createEventDispatcher<{
		create: string
		toggle: string
		remove: string
	}>()

	let name = ""

	$: [done, notdone] = partition(todos, ({ done }) => done)

	function onKeydown(e: KeyboardEvent) {
		if (e.key == "Enter") {
			emit("create", name)
			name = ""
		}
	}
</script>

<div id="container" style="border-radius: {radius};">
	{#if title}
		<h2>{title}</h2>
	{/if}
	<input
		type="text"
		bind:value={name}
		on:keydown={onKeydown}
		placeholder="New TODO"
	/>
	<div id="todos">
		<ul>
			{#each notdone as todo (todo.id)}
				<li class="notdone">
					<label>
						<input
							type="checkbox"
							id={todo.id}
							checked={todo.done}
							on:change={() => emit("toggle", todo.id)}
						/>
						<span title={todo.name}>{todo.name}</span>
						<button
							class="trash"
							title="Delete todo"
							on:click={() => emit("remove", todo.id)}
							><Icontrash /></button
						>
					</label>
				</li>
			{:else}
				<p>You're all done!</p>
			{/each}
		</ul>
		<ul>
			{#each done as todo (todo.id)}
				<li class="done">
					<label>
						<input
							type="checkbox"
							id={todo.id}
							checked={todo.done}
							on:change={() => emit("toggle", todo.id)}
						/>
						<span title={todo.name}>{todo.name}</span>
						<button
							style="--opacity: 0.3"
							class="trash"
							title="Delete todo"
							on:click={() => emit("remove", todo.id)}
							><Icontrash /></button
						>
					</label>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	#container {
		display: grid;
		grid-template-rows: auto auto 1fr;
		border: 1px solid var(--color-borders, black);
		padding: 0.5rem;
		accent-color: var(--color-accent);
		min-height: 0;
		height: 100%;
	}

	h2 {
		text-align: center;
		font-size: 1.3rem;
		font-weight: 600;
		word-break: keep-all;
	}

	input[type="text"] {
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--color-accent);
		color: var(--color-text);
		min-width: 0;
	}

	#todos {
		min-height: 0;
		overflow-y: auto;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	.done {
		transition: opacity 0.2s ease-in-out;
		opacity: 0.5;
	}
	.done:hover,
	.done:focus {
		opacity: 1;
	}

	label {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0 0.5rem;
		cursor: pointer;
	}
	label > span {
		flex-grow: 1;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.trash {
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		color: currentColor;
		opacity: var(--opacity, 0.01);
		transition: opacity 0.2s ease-in-out;
	}
	.trash:hover,
	.trash:focus {
		opacity: 1;
	}
</style>