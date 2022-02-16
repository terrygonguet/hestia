import { names as migrationNames } from "$/migrations"
import { AppliedMigration, applyMigrations, persist } from "$/utils"
import browser from "webextension-polyfill"

browser.runtime.onInstalled.addListener(async function (e) {
	const { reason, previousVersion } = e
	switch (reason) {
		case "install":
			// TODO: open documentation page probably
			const applied = migrationNames.map(name => ({
				name,
				time: new Date(),
			}))
			await persist<{
				migrations: AppliedMigration[]
			}>({ migrations: applied })
			break
		case "update":
			await applyMigrations()
			break
	}
})
