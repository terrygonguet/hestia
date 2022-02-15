<script context="module" lang="ts">
	export function baseConfig(): Config {
		return {
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
	}
</script>

<script lang="ts">
	import { applyMigrations } from "$/background"
	import type { Config } from "$/types"
	import { compareShape, getAs, persist } from "$/utils"
	import { forEach, parse } from "$/utils/compdef"
	import { isLeft } from "$/utils/result"
	import ColorField from "$lib/components/ColorField.svelte"
	import ConfigWidget from "$lib/components/ConfigWidget.svelte"
	import GlobalStyles from "$lib/components/GlobalStyles.svelte"
	import { onMount, tick } from "svelte"
	import IconAdd from "virtual:icons/ion/md-add"
	import IconRefresh from "virtual:icons/ion/md-refresh"
	import IconTrash from "virtual:icons/ion/trash-sharp"
	import browser from "webextension-polyfill"

	let config = baseConfig()
	let showCustomColorsInfo = false

	async function save() {
		await tick()
		return persist({ config })
	}

	async function download() {
		const data = await browser.storage.local.get(null)
		const file = JSON.stringify(data, null, 2)
		const blob = new Blob([file], { type: "application/json" })
		const a = document.createElement("a")
		a.download = `backup-${import.meta.env.VERSION}.json`
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
				if (isLeft(root))
					throw new Error("Invalid component tree: " + root.value)

				if (!compareShape(baseConfig(), raw.config))
					throw new Error("Invalid config shape.")

				if (raw.migrations && !Array.isArray(raw.migrations))
					throw new Error("Invalid migrations object.")
				const migrations = raw.migrations?.map(
					({ name, time }: any) => {
						if (typeof name != "string")
							throw new Error("Invalid migrations object.")
						const date = new Date(time)
						if (date.toString() == "Invalid Date")
							throw new Error("Invalid migrations object.")
						return { name, time: date }
					},
				)

				const data: any = {
					root: root.value,
					config: raw.config,
					migrations,
				}
				forEach(root.value, comp => (data[comp.id] = raw[comp.id]))

				await persist(data)
				await applyMigrations()
				const fresh = await getAs<Config>("config")
				config = Object.assign(config, fresh)
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

	async function clear() {
		if (
			prompt(
				'This will delete ALL of your data! To continue, type "clear everything".',
			) == "clear everything"
		) {
			config = baseConfig()
			return browser.storage.local.clear()
		}
	}

	async function addCustomColor() {
		config.customColors.push({ name: "", value: "#000000" })
		config = config
		return save()
	}

	function removeCustomColor(i: number) {
		return async function () {
			config.customColors.splice(i, 1)
			config = config
			return save()
		}
	}

	async function reset() {
		config.baseColors = baseConfig().baseColors
		return save()
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
				<p><button type="button" tabindex="-1">Example</button></p>
				<ColorField
					label="Button text:"
					bind:value={config.baseColors.textButton}
					name="base-text-button"
				/>
				<div />
				<button
					type="button"
					title="Restore all colors to default"
					class="span-all"
					on:click={reset}
				>
					<IconRefresh />
					Restore default values
				</button>
			</div>
			<h2>
				Custom colors<button
					type="button"
					class="info"
					title="What are custom colors?"
					on:click={() =>
						(showCustomColorsInfo = !showCustomColorsInfo)}
					>?</button
				>
			</h2>
			{#if showCustomColorsInfo}
				<p class="info-text">
					You can add any number of colors that custom components can
					use via the <code style="white-space: nowrap;"
						>--customcolor-(name)</code
					> css variables.
				</p>
			{/if}
			<div class="fields">
				{#each config.customColors as color, i}
					<ColorField
						bind:label={color.name}
						bind:value={color.value}
						editableName={true}
					/>
					<button
						type="button"
						title="Remove this custom color"
						on:click={removeCustomColor(i)}><IconTrash /></button
					>
				{/each}
				<button
					type="button"
					title="Add new custom color"
					class="span-all"
					on:click={addCustomColor}
					><IconAdd width="1.5rem" height="1.5rem" /></button
				>
			</div>
			<h2>Sync & backup</h2>
			<div id="sync-n-backup">
				<!-- <div>
					<SyncButton />
				</div> -->
				<div>
					<button
						type="button"
						title="Download a backup file"
						on:click={download}>Save backup</button
					>
					<button
						type="button"
						title="Restore from a backup file"
						on:click={restore}>Restore backup</button
					>
				</div>
				<div>
					<button
						type="button"
						title="Clear all config and components"
						on:click={clear}>Clear all data</button
					>
				</div>
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
		margin: 2rem;
	}

	.fields {
		display: inline-grid;
		gap: 1rem;
		grid-template-columns: repeat(4, auto);
		align-items: center;
		min-width: 50ch;
	}
	.span-all {
		grid-column: span 4;
		margin: 0;
	}

	hr {
		border-color: transparent;
		border-top: 1px solid var(--color-borders);
	}

	.fields > p {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	#sync-n-backup {
		display: flex;
		gap: 2rem;
		flex-direction: column;
	}
	#sync-n-backup > div {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	.info {
		width: 2.3rem;
		height: 2.3rem;
		border-radius: 100%;
		display: inline-grid;
		place-items: center;
		line-height: 1;
		font-size: 1.3rem;
		margin: 0 1rem;
	}

	.info-text {
		max-width: 80ch;
		margin-bottom: 2rem;
		text-align: center;
	}
</style>
