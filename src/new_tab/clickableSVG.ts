import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"

const template = `
<div class="cursor-pointer inline-flex">
  <object 
    type="image/svg+xml"
    :data="'../resources/svg/' + icon + '.svg'"
    :class="['pointer-none', 'w-' + width]"
  >{{ placeholder }}</object>
</div>`

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
