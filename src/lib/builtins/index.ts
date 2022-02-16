import type { Component } from "$/types"
import * as Stack from "./Stack"
import * as Grid from "./Grid"
import * as LinkList from "./LinkList"
import * as MultiText from "./MultiText"
import * as Box from "./Box"
import * as Spacer from "./Spacer"
import * as Text from "./Text"
import * as TextArea from "./TextArea"
import * as Time from "./Time"
import * as TODOList from "./TODOList"

export const builtins = {
	Stack: Stack as Component,
	Grid: Grid as Component,
	LinkList: LinkList as Component,
	MultiText: MultiText as Component,
	Box: Box as Component,
	Text: Text as Component,
	TextArea: TextArea as Component,
	Time: Time as Component,
	TODOList: TODOList as Component,
}

export { Stack, Spacer, Box, TextArea, Text, Time, LinkList, Grid }
