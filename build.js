#!/usr/bin/env zx

import "zx/globals"

const { version } = JSON.parse(await fs.readFile("./manifest-firefox.json"))

// Build default version
await $`VERSION=${version} ENV_BROWSER=firefox npx vite build`
await $`cp ./manifest-firefox.json ./dist/manifest.json`
await $`npx web-ext build -s ./dist`

// Build chrome version
await $`VERSION=${version} ENV_BROWSER=chrome npx vite build`
const chromeManifest = JSON.parse(await fs.readFile("./manifest-chrome.json"))
chromeManifest.version = version
const assets = await fs.readdir("./dist/assets")
const bgscript = assets.find(id => id.startsWith("background."))
if (!bgscript) throw new Error("Can't find background script in emmited assets")
chromeManifest.background.service_worker = bgscript
await fs.writeFile(
	"./dist/manifest.json",
	JSON.stringify(chromeManifest, null, 2),
)
await $`npx web-ext build -s ./dist -n hestia-${version}-chrome.zip`
