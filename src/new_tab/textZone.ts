import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"
import { Widget } from "./store"

const template = `
<textarea
  class="rounded border border-main p-2 bg-block flex flex-col resize-none"
  :style="gridSpan"
  v-model="widget.text"
  placeholder="Double click to edit, type to store some text"
></textarea>`

export interface TextZone {
  type: "TextZone"
  id: string
  text: string
  width: number
  height: number
}

type Props = {
  id: string
  width: number
  height: number
  text: string
}
type Data = {}
type Methods = {}
type Computed = {
  gridSpan: object
  widget: TextZone
}

const component: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  name: "TextZone",
  props: {
    id: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
    text: {
      type: String,
      default: "",
    },
  },
  template,
  computed: {
    gridSpan() {
      return {
        "grid-column": "span " + this.width,
        "grid-row": "span " + this.height,
      }
    },
    widget() {
      return this.$store.state.widgets.find((w: Widget) => w.id == this.id)
    },
  },
  methods: {},
}

export default component

export function create(): TextZone {
  return {
    type: "TextZone",
    id: Date.now()
      .toString(36)
      .substr(2),
    height: 1,
    width: 1,
    text: "",
  }
}
