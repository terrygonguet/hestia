<script lang="ts">
	import type { TODO } from "$lib/builtins/TODOList"
	import partition from "just-partition"
	import { createEventDispatcher } from "svelte"
	import { flip } from "svelte/animate"
	import { crossfade } from "svelte/transition"
	import IconTrash from "virtual:icons/ion/trash-sharp"

	export let todos: TODO[]
	export let title = ""
	export let radius = "0"
	export let border = true

	const emit = createEventDispatcher<{
		create: string
		toggle: string
		remove: string
	}>()
	const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),
	})

	let name = ""

	$: [done, notdone] = partition(todos, ({ done }) => done)

	function onKeydown(e: KeyboardEvent) {
		if (e.key == "Enter" && name) {
			emit("create", name)
			name = ""
		}
	}
</script>

<div id="container" style="border-radius: {radius};" class:border>
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
				<li
					class="notdone"
					animate:flip={{ duration: 200 }}
					in:receive={{ key: todo.id }}
					out:send={{ key: todo.id }}
				>
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
							><IconTrash /></button
						>
					</label>
				</li>
			{:else}
				<li>
					<p id="all-done">You're all done!</p>
				</li>
			{/each}
		</ul>
		<ul>
			{#each done as todo (todo.id)}
				<li
					class="done"
					animate:flip={{ duration: 200 }}
					in:receive={{ key: todo.id }}
					out:send={{ key: todo.id }}
				>
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
							><IconTrash /></button
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
		padding: 0.5rem;
		accent-color: var(--color-accent);
		min-height: 0;
		height: 100%;
	}
	.border {
		border: 1px solid var(--color-borders, black);
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
		border-bottom: 1px solid var(--color-text);
		color: var(--color-text);
		min-width: 0;
		margin-bottom: 0.5rem;
	}

	#all-done {
		text-align: center;
		opacity: 0.7;
	}

	#todos {
		min-height: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
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
