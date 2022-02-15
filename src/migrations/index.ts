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
					if ((def.type as any) != "Padding") continue
					const { [def.id]: data } = await browser.storage.local.get(
						def.id,
					)
					if (!data) continue
					data.paddings = [data.padding]
					await browser.storage.local.set({ [def.id]: data })
				}
				await browser.storage.local.set({ updatedAt: Date.now() })
			},
			async down() {},
		},
	],
	[
		"1.2.0",
		{
			async up() {
				const root = await getAs<ComponentDefinition>("root")
				if (isNone(root)) return
				const defs = flatten(root)
				for (const def of defs) {
					if ((def.type as any) == "Container") def.type = "Stack"
					if ((def.type as any) == "Padding") def.type = "Box"
					if ((def.type as any) == "Spacer") {
						def.type = "Box"
						const { [def.id]: data } =
							await browser.storage.local.get(def.id)
						if (!data) continue
						data.paddings = [0]
						await browser.storage.local.set({ [def.id]: data })
					}
				}
				await browser.storage.local.set({ root, updatedAt: Date.now() })
			},
			async down() {},
		},
	],
	[
		"1.3.0",
		{
			async up() {
				// to be sure
				await browser.storage.local.set({ updatedAt: Date.now() })
			},
			async down() {},
		},
	],
])

export const names = Array.from(migrations.keys())

export default migrations
