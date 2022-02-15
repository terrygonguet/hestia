<script lang="ts">
	import { getAs } from "$/utils"
	import { createEventDispatcher } from "svelte"

	const labels = {
		idle: "Sync via browser",
		syncing: "Syncing...",
		done: "Done!",
		error: "An error happened",
		uptodate: "Already up to date",
	}
	const emit = createEventDispatcher<{ sync: never }>()

	switch (import.meta.env.ENV_BROWSER) {
		case "firefox":
			labels.idle = "Sync with Firefox"
			break
		case "chrome":
			labels.idle = "Sync with Chrome"
			break
	}

	let state: "idle" | "syncing" | "done" | "error" | "uptodate" = "idle"
	let timeoutID: number

	$: disabled = state == "syncing"
	$: label = labels[state]

	async function browserSync() {
		clearTimeout(timeoutID)
		timeoutID = window.setTimeout(() => (state = "syncing"), 100)

		try {
			const sync = (await getAs<number>("updatedAt", "sync")) ?? 0
			const local = (await getAs<number>("updatedAt", "local")) ?? 0

			if (local == sync) {
				// assume sync'd, TODO: don't
				state = "uptodate"
			} else if (local > sync) {
				await browser.storage.sync.set(
					await browser.storage.local.get(),
				)
				state = "done"
			} else {
				await browser.storage.local.set(
					await browser.storage.sync.get(),
				)
				state = "done"
				emit("sync")
			}
		} catch (error) {
			state = "error"
			console.error(error)
		}

		clearTimeout(timeoutID)
		timeoutID = window.setTimeout(() => (state = "idle"), 1500)
	}
</script>

<button on:click={browserSync} type="button" {disabled} {...$$props}
	>{label}</button
>
