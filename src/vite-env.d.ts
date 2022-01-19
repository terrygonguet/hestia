/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly ENV_BROWSER?: "firefox" | "chrome"
	readonly VERSION: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
