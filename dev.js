#!/usr/bin/env zx

import "zx/globals"
import { build } from "vite"
import chokidar from "chokidar"

let isBuilding = false
async function buildApp() {
	if (isBuilding) return
	isBuilding = true
	await build({
		mode: "development",
	})
	await $`cp ./manifest-firefox.json ./dist/manifest.json`
	isBuilding = false
}

await buildApp()
chokidar
	.watch(["src", "public", "*.html", "manifest-*.json"])
	.on("all", () => buildApp())
await $`npx web-ext run -s ./dist --no-reload`
