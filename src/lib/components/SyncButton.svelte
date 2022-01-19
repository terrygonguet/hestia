<script lang="ts">
	let label = "Sync"
	switch (import.meta.env.ENV_BROWSER) {
		case "firefox":
			label = "Sync Firefox"
			break
		case "chrome":
			label = "Sync Chrome"
			break
	}

	async function sync() {}

	function info() {}
</script>

<button on:click={sync} type="button">{label}</button>
<button on:click={info} type="button" id="info">ℹ</button>

<style>
	#info {
		border: 1px solid var(--color-accent, coral);
		color: var(--color-text, white);
		border-radius: 100%;
		background-color: transparent;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
	}
</style>
