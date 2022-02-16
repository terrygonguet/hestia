import { svelte } from "@sveltejs/vite-plugin-svelte"
import { resolve } from "path"
import { defineConfig } from "vite"
import Icons from "unplugin-icons/vite"

// https://vitejs.dev/config/
export default defineConfig(env => ({
	envPrefix: "ENV_",
	plugins: [
		svelte(),
		Icons({
			compiler: "svelte",
			defaultStyle: "vertical-align: middle;",
		}),
	],
	resolve: {
		alias: {
			$lib: resolve("./src/lib"),
			$: resolve("./src"),
		},
	},
	build: {
		sourcemap: true,
		emptyOutDir: true,
		rollupOptions: {
			input: [
				"index.html",
				"edit.html",
				"options.html",
				"background.html",
				"src/background.ts",
			],
		},
	},
}))
