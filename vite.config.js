import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	build: {
		sourcemap: "inline",
		emptyOutDir: true,
		watch: {},
		rollupOptions: {
			input: {
				index: "index.html",
				edit: "edit.html",
				options: "options.html",
			},
		},
	},
})
