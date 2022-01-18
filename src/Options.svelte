<script context="module" lang="ts">
	export const baseConfig: Config = {
		baseColors: {
			background: "#ffffff",

			backgroundCode: "#e3e3e3",
			textCode: "#000000",
			borderCode: "#555555",

			text: "#000000",
			textQuiet: "#333333",
			accent: "coral",
			accentLight: "#f39f81",
			borders: "#000000",
		},
		customColors: [],
	}
</script>

<script lang="ts">
	import { onMount, tick } from "svelte"
	import ConfigWidget from "./lib/components/ConfigWidget.svelte"
	import browser from "webextension-polyfill"
	import ColorField from "./lib/components/ColorField.svelte"
	import GlobalStyles from "./lib/components/GlobalStyles.svelte"
	import type { Config } from "./types"

	let config = baseConfig

	async function save() {
		await tick()
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
					bind:value={config.baseColors.background}
					name="base-background"
				/>
				<div />
				<ColorField
					label="Text:"
					bind:value={config.baseColors.text}
					name="base-text"
				/>
				<p>Example</p>
				<ColorField
					label="Text light:"
					bind:value={config.baseColors.textQuiet}
					name="base-text-quiet"
				/>
				<p style="color: var(--color-textQuiet)">Example</p>
				<ColorField
					label="Accent color:"
					bind:value={config.baseColors.accent}
					name="base-accent"
				/>
				<p>
					<span style="color: var(--color-accent)">Text</span>
					<span
						style="background: var(--color-accent); padding: 0 0.2rem;"
						>Background</span
					>
				</p>
				<ColorField
					label="Lighter accent color:"
					bind:value={config.baseColors.accentLight}
					name="base-accent-light"
				/>
				<p>
					<span style="color: var(--color-accentLight)">Text</span>
					<span
						style="background: var(--color-accentLight); padding: 0 0.2rem;"
						>Background</span
					>
				</p>
				<ColorField
					label="Borders:"
					bind:value={config.baseColors.borders}
					name="base-borders"
				/>
				<p style="border: 1px solid var(--color-borders)">Example</p>
				<hr class="span-all" />
				<ColorField
					label="Background code:"
					bind:value={config.baseColors.backgroundCode}
					name="base-background-code"
				/>
				<div />
				<ColorField
					label="Text code:"
					bind:value={config.baseColors.textCode}
					name="base-text-code"
				/>
				<p><code>Example</code></p>
				<ColorField
					label="Border code:"
					bind:value={config.baseColors.borderCode}
					name="base-border-code"
				/>
				<div />
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
		grid-template-columns: repeat(4, auto);
		align-items: center;
	}
	.span-all {
		grid-column: span 4;
		margin: 0;
		border-color: transparent;
		border-top: 1px solid var(--color-borders);
	}

	p {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}
</style>
