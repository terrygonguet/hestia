import migrations, { names as migrationNames } from "$/migrations"
import { getAs, setAs } from "$/utils"
import browser from "webextension-polyfill"

type AppliedMigration = {
	name: string
	time: Date
}

browser.runtime.onInstalled.addListener(async function (e) {
	const { reason, previousVersion } = e
	switch (reason) {
		case "install":
			// TODO: open documentation page probably
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
