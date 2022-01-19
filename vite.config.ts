import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path"
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(env => ({
	envPrefix: "ENV_",
	plugins: [svelte()],
	resolve: {
		alias: {
			"$lib": resolve(__dirname, "./src/lib"),
			"$": resolve(__dirname, "./src"),
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
