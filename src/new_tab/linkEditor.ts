import Vue from "vue"
import ClickableSVG from "./clickableSVG.js"
import { Link } from "./category.js"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"

const template = `
<div class="flex flex-row justify-center">
  <div class="flex flex-col flex-grow">
    <input v-model="link.title" class="bg-transparent" placeholder="Title"/>
    <input v-model="link.href" class="bg-transparent" placeholder="URL"/>
  </div>
  <div class="flex flex-col justify-center">
    <ClickableSVG
      :width="4"
      icon="chevron-up"
      placeholder="^"
      @click.native="$emit('reorder', -1)"/>
    <ClickableSVG
      :width="4"
      icon="chevron-down"
      placeholder="v"
      @click.native="$emit('reorder', 1)"/>
  </div>
  <ClickableSVG
    :width="6"
    icon="bin"
    placeholder="X"
    @click.native="$emit('delete')"/>
</div>`

type Props = {
  link: Link
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
  name: "LinkEditor",
  components: { ClickableSVG },
  props: {
    link: {
      type: Object,
      required: true,
    },
  },
  template,
}

export default component
