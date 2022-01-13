import type { builtins } from "./lib/builtins"

type Context = {
	children: Node[]
	setState(data: Object): Promise<void>
	onDestroy(f: () => void): void
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

type EditorConfig = EditorFieldConfig[]

type EditorFieldConfig =
	| {
			type: "text"
			prop: string
			label: string
			info?: string
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
