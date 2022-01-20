import type { Component } from "$/types"
import * as Container from "./Container"
import * as DefaultDisplay from "./DefaultDisplay"
import * as Grid from "./Grid"
import * as LinkList from "./LinkList"
import * as MultiText from "./MultiText"
import * as Padding from "./Padding"
import * as Spacer from "./Spacer"
import * as Text from "./Text"
import * as TextArea from "./TextArea"
import * as Time from "./Time"
import * as TODOList from "./TODOList"

export const builtins = {
	Container: Container as Component,
	Grid: Grid as Component,
	LinkList: LinkList as Component,
	MultiText: MultiText as Component,
	Padding: Padding as Component,
	Spacer: Spacer as Component,
	Text: Text as Component,
	TextArea: TextArea as Component,
	Time: Time as Component,
	TODOList: TODOList as Component,
}

export {
	DefaultDisplay,
	Container,
	Spacer,
	Padding,
	TextArea,
	Text,
	Time,
	LinkList,
	Grid,
}
