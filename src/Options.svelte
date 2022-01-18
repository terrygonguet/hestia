<script context="module" lang="ts">
	export const baseConfig: Config = {
		baseColors: {
			background: "#ffffff",
			text: "#000000",
			textLight: "#2a2a2a",
			textLightest: "#444444",
			accent: "coral",
			borders: "#000000",
		},
		customColors: [],
	}
</script>

<script lang="ts">
	import { onMount } from "svelte"
	import ConfigWidget from "./lib/components/ConfigWidget.svelte"
	import browser from "webextension-polyfill"
	import ColorField from "./lib/components/ColorField.svelte"
	import GlobalStyles from "./lib/components/GlobalStyles.svelte"
	import type { Config } from "./types"

	let config = baseConfig

	$: baseColors = config.baseColors

	async function save() {
		return browser.storage.local.set({ config })
	}

	onMount(async () => {
		const stored = await browser.storage.local.get("config")
		config = Object.assign(config, stored.config)
	})
</script>

<GlobalStyles />
<ConfigWidget current="options" />
<main id="container">
	<form on:submit|preventDefault on:change={save}>
		<fieldset>
			<legend>Config</legend>
			<h2>Base colors:</h2>
			<div class="fields">
				<ColorField
					label="Background:"
					bind:value={baseColors.background}
					name="base-background"
				/>
				<ColorField
					label="Text:"
					bind:value={baseColors.text}
					name="base-text"
				/>
				<ColorField
					label="Text light:"
					bind:value={baseColors.textLight}
					name="base-text-light"
				/>
				<ColorField
					label="Text lightest:"
					bind:value={baseColors.textLightest}
					name="base-text-lightest"
				/>
				<ColorField
					label="Accent color:"
					bind:value={baseColors.accent}
					name="base-accent"
				/>
				<ColorField
					label="Borders:"
					bind:value={baseColors.borders}
					name="base-borders"
				/>
			</div>
		</fieldset>
	</form>
</main>

<style>
	#container {
		padding: 1rem;
		height: 100%;
		background-color: var(--color-background, #fff);
		color: var(--color-text, #000);
	}

	form {
		height: 100%;
	}

	fieldset {
		height: 100%;
	}

	h2 {
		margin-bottom: 1rem;
	}

	.fields {
		display: inline-grid;
		gap: 1rem;
		grid-template-columns: auto auto auto;
		align-items: center;
	}
</style>
