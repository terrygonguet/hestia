import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"

const template = `
<img
  :src="'../resources/svg/' + icon + '.svg'"
  :class="['w-' + width]"
  class="cursor-pointer inline-flex stroke-current"
  :alt="placeholder"
/>`

type Props = {
  width: number
  icon: string
  placeholder: string
}
type Data = {}
type Methods = {}
type Computed = {}

const component: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  name: "ClickableSVG",
  props: {
    width: {
      type: Number,
      default: 6,
    },
    icon: {
      type: String,
      default: "anchor",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  template,
}

export default component
