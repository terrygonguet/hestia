<script lang="ts">
	import HomeIcon from "virtual:icons/ion/home"
	import GearIcon from "virtual:icons/ion/ios-gear"
	import EditIcon from "virtual:icons/ion/edit"

	export let current: "edit" | "options" | "home"
	export let allowFade = false
</script>

<aside class:fade={allowFade}>
	{#if current != "home"}
		<a href="/index.html" title="Home"><HomeIcon /></a>
	{/if}
	{#if current != "edit"}
		<a href="/edit.html" title="Edit"><EditIcon /></a>
	{/if}
	{#if current != "options"}
		<a href="/options.html" title="Config"><GearIcon /></a>
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
		line-height: 1;
	}
	.fade {
		opacity: 0.1;
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
