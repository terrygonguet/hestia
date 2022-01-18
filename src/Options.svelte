<script context="module" lang="ts">
	export const baseConfig: Config = {
		baseColors: {
			background: "#ffffff",

			backgroundCode: "#e3e3e3",
			textCode: "#000000",
			borderCode: "#555555",

			backgroundButton: "coral",
			backgroundButtonHover: "#f39f81",
			textButton: "#000000",

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
	import { forEach, parse } from "./utils/compdef"
	import { compareShape } from "./utils"

	let config = baseConfig

	async function save() {
		await tick()
		return browser.storage.local.set({ config })
	}

	async function download() {
		const data = await browser.storage.local.get(null)
		const file = JSON.stringify(data, null, 2)
		const blob = new Blob([file], { type: "application/json" })
		const a = document.createElement("a")
		a.download = "backup.json"
		a.href = URL.createObjectURL(blob)
		a.click()
	}

	async function restore() {
		const stored = await browser.storage.local.get(null)
		if (
			Object.keys(stored).length > 0 &&
			!confirm(
				"This will overwrite all of your current data, are you sure you want to continue?",
			)
		)
			return
		const input = document.createElement("input")
		input.type = "file"
		input.multiple = false
		input.accept = "application/json"
		input.click()
		input.onchange = async () => {
			if (!input.files?.length) return
			try {
				const [file] = input.files
				const text = await file.text()
				const raw = JSON.parse(text)

				const root = parse(raw.root)
				if (!root) throw new Error("Invalid component tree.")

				if (!compareShape(baseConfig, raw.config))
					throw new Error("Invalid config shape.")

				const data: any = { root, config: raw.config }
				forEach(root, comp => (data[comp.id] = raw[comp.id]))

				await browser.storage.local.set(data)
				config = Object.assign(config, data.config)
			} catch (error) {
				console.error(error)
				if (error instanceof SyntaxError)
					alert("Can't import data: The file contains bad JSON.")
				else if (error instanceof Error)
					alert("Can't import data: " + error.message)
				else
					alert(
						"An unknown error happened while importing the backup data.",
					)
			}
		}
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
			<h2>Base colors</h2>
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
					label="Pill background:"
					bind:value={config.baseColors.backgroundCode}
					name="base-background-code"
				/>
				<div />
				<ColorField
					label="Pill text:"
					bind:value={config.baseColors.textCode}
					name="base-text-code"
				/>
				<p><code>Example</code></p>
				<ColorField
					label="Pill border:"
					bind:value={config.baseColors.borderCode}
					name="base-border-code"
				/>
				<div />
				<hr class="span-all" />
				<ColorField
					label="Button background:"
					bind:value={config.baseColors.backgroundButton}
					name="base-background-button"
				/>
				<div />
				<ColorField
					label="Button hover:"
					bind:value={config.baseColors.backgroundButtonHover}
					name="base-background-hover-button"
				/>
				<p><button type="button">Example</button></p>
				<ColorField
					label="Button text:"
					bind:value={config.baseColors.textButton}
					name="base-text-button"
				/>
				<div />
			</div>
			<h2>Sync & backups</h2>
			<div id="sync">
				<button type="button" on:click={download}
					>Download backup</button
				>
				<button type="button" on:click={restore}>Restore backup</button>
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
		font-size: 115%;
	}

	fieldset {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow-y: auto;
	}

	h2 {
		margin: 2.5rem;
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

	#sync {
		display: flex;
		gap: 1rem;
	}
</style>
