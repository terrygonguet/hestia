type Context = {
	children: Node[]
	setState(data: Object): Promise<void>
}

type Component<Data = any> = {
	initState(): Data
	render(state: Data, context: Context): Promise<Node>
}

type ComponentDefinition =
	| {
			id: string
			type: "Divider" | "TestDiv" | "DefaultDisplay"
			children?: ComponentDefinition[]
	  }
	| {
			id: string
			type: "Custom"
			url: string
			children?: ComponentDefinition[]
	  }
