import browser from "webextension-polyfill"
import { getAs, setAs } from "$/utils"
import { flatten } from "$/utils/compdef"
import type { ComponentDefinition } from "$/types"
import { isNone } from "$/utils/maybe"

type Migration = {
	up(): Promise<void>
	down(): Promise<void>
}

type AppliedMigration = {
	name: string
	time: Date
}

const migrations = new Map<string, Migration>([
	[
		"1.0.1",
		{
			async up() {
				const root = await getAs<ComponentDefinition>("root")
				if (isNone(root)) return
				const defs = flatten(root)
				for (const def of defs) {
					if (def.type != "Padding") continue
					const { [def.id]: data } = await browser.storage.local.get(
						def.id,
					)
					if (!data) continue
					data.paddings = [data.padding]
					await browser.storage.local.set({ [def.id]: data })
				}
			},
			async down() {},
		},
	],
])

browser.runtime.onInstalled.addListener(async function (e) {
	const { reason, previousVersion } = e
	switch (reason) {
		case "install":
			// TODO: open documentation page probably
			const migrationNames = Array.from(migrations.keys())
			const applied = migrationNames.map(name => ({
				name,
				time: new Date(),
			}))
			await setAs<{
				migrations: AppliedMigration[]
			}>({ migrations: applied })
			break
		case "update":
			await applyMigrations()
			break
	}
})

export async function applyMigrations() {
	const applied = (await getAs<AppliedMigration[]>("migrations")) ?? []
	for (const [name, { up }] of migrations) {
		if (applied.find(am => am.name == name)) continue
		console.log(`Applying migration "${name}"...`)
		await up()
		applied.push({ name, time: new Date() })
	}
	await setAs<{
		migrations: AppliedMigration[]
	}>({ migrations: applied })
}
