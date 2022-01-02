import { resolve } from "path"

/** @type {import("vite").UserConfig} */
const config = {
	build: {
		sourcemap: true,
		watch: {},
		emptyOutDir: true,
		rollupOptions: {
			input: {
				index: resolve(__dirname, "index.html"),
				options: resolve(__dirname, "options.html"),
				edit: resolve(__dirname, "edit.html"),
			},
		},
	},
}

export default config
