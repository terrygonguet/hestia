import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"
import ClickableSVG from "./clickableSVG.js"
import { TextZone } from "./textZone"

const template = `
<div class="p-4 w-1/2 bg-block border border-main rounded flex flex-col justify-center">
  <div class="flex flex-row justify-around">
    <div>
      <ClickableSVG
        :width="6"
        icon="chevron-left"
        placeholder="<"
        @click.native="$emit('reorder', -1)"/>
      <ClickableSVG
        :width="6"
        icon="chevron-right"
        placeholder=">"
        @click.native="$emit('reorder', 1)"/>
    </div>
    <ClickableSVG
      :width="6"
      icon="bin"
      placeholder="X"
      @click.native="$emit('delete')"/>
  </div>

  <h2 class="text-center text-accent text-2xl">Text Zone</h2>

  <label class="flex justify-between text-accent">
    Width <input v-model.number="object.width" type="number" min="1" class="w-12 bg-transparent text-main"/>
  </label>
  <label class="flex justify-between text-accent">
    Height <input v-model.number="object.height" type="number" min="1" class="w-12 bg-transparent text-main"/>
  </label>

</div>`

type Props = {
  object: TextZone
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
  name: "TextZoneEditor",
  components: { ClickableSVG },
  props: {
    object: {
      type: Object,
      required: true,
    },
  },
  template,
  methods: {},
}

export default component
