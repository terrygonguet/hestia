import type { builtins } from "./lib/builtins"

type Context = {
	children: Node[]
	setState(data: Object): Promise<void>
	onDestroy(f: () => void): void
	config: Config
}

type Component<Data = any> = {
	initState(): Data
	render(state: Data, context: Context): Promise<Node>
	name: string
	editorConfig?: EditorConfig
}

type ComponentDefinition =
	| {
			id: string
			name?: string
			type: keyof typeof builtins
			children?: ComponentDefinition[]
	  }
	| {
			id: string
			name?: string
			type: "Custom"
			url: string
			children?: ComponentDefinition[]
	  }

type EditorConfig = (
	| EditorFieldConfig
	| { type: "info"; html: string }
	| { type: "divider" }
)[]

type EditorFieldConfig =
	| {
			type: "text"
			prop: string
			label: string
			info?: string
			placeholder?: string
	  }
	| {
			type: "select"
			prop: string
			label: string
			info?: string
			options: { label: string; value: string | number }[]
	  }
	| {
			type: "number"
			prop: string
			label: string
			info?: string
			min?: number
			max?: number
			step?: number
	  }
	| {
			type: "boolean"
			prop: string
			label: string
			info?: string
	  }
	| ArrayEditorFieldConfig

type ArrayEditorFieldConfig = {
	type: "array"
	prop: string
	label: string
	info?: string
	subfields: EditorFieldConfig | EditorFieldConfig[]
}

type Config = {
	baseColors: {
		background: string
		backgroundCode: string
		textCode: string
		borderCode: string
		text: string
		textQuiet: string
		accent: string
		accentLight: string
		borders: string
		backgroundButton: string
		backgroundButtonHover: string
		textButton: string
	}
	customColors: { name: string; value: string }[]
}
