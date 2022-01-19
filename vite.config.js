import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"

// https://vitejs.dev/config/
export default defineConfig(env => ({
	envPrefix: "ENV_",
	plugins: [svelte()],
	resolve: {
		alias: {
			"$lib": "src/lib",
			"$": "src",
		}
	},
	build: {
		sourcemap: "inline",
		emptyOutDir: true,
		watch: env.mode == "development" ? {} : false,
		rollupOptions: {
			input: {
				index: "index.html",
				edit: "edit.html",
				options: "options.html",
			},
		},
	},
}))
