import type { ComponentDefinition } from "$/types"
import { getAs } from "$/utils"
import { flatten } from "$/utils/compdef"
import { isNone } from "$/utils/maybe"

export type Migration = {
	up(): Promise<void>
	down(): Promise<void>
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

export const names = Array.from(migrations.keys())

export default migrations
