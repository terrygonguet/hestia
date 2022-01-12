<script lang="ts">
	export let current: "edit" | "options" | "home"
	export let allowFade = false
</script>

<aside class:fade={allowFade}>
	{#if current != "home"}
		<a href="/index.html" title="Home">⌂</a>
	{/if}
	{#if current != "edit"}
		<a href="/edit.html" title="Edit">✏</a>
	{/if}
	{#if current != "options"}
		<a href="/options.html" title="Config">⚙</a>
	{/if}
</aside>

<style>
	aside {
		position: fixed;
		top: 0;
		right: 0;
		background-color: #333;
		display: flex;
		border-bottom-left-radius: 0.5rem;
		transition: background-color 0.4s ease-in-out, opacity 0.3s ease-in-out;
		overflow: hidden;
	}
	.fade {
		opacity: 0;
	}
	aside:hover {
		opacity: 1;
	}

	a {
		color: white;
		border: none;
		padding: 0.5rem 0.75rem;
		background: transparent;
		cursor: pointer;
		text-decoration: none;
	}
	a:active {
		background-color: #555;
	}
</style>
