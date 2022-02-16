/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/svelte" />

interface ImportMetaEnv {
	readonly ENV_BROWSER?: "firefox" | "chrome"
	readonly ENV_VERSION?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
