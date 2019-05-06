import Vue from "vue"
import { Category, Link } from "./category.js"
import LinkEditor from "./linkEditor.js"
import ClickableSVG from "./clickableSVG.js"
import svgs from "../resources/svgs.js"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"

const template = `
<div class="p-4 w-1/4 bg-block border border-main rounded flex flex-col justify-center">
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

  <label class="flex justify-between">
    Title <input v-model="object.title" class="bg-transparent text-right"/>
  </label>
  <label class="flex justify-between">
    Icon
    <select v-model="object.icon" class="bg-transparent text-right">
      <option
        v-for="svg in svgs"
        :value="svg"
      >{{ svg }}</option>
    </select>
  </label>
  <label class="flex justify-between">
    Width <input v-model.number="object.width" type="number" min="1" class="w-12 bg-transparent"/>
  </label>
  <label class="flex justify-between">
    Height <input v-model.number="object.height" type="number" min="1" class="w-12 bg-transparent"/>
  </label>

  <h2 class="text-center">Links</h2>

  <LinkEditor 
    v-for="(link, i) in object.links"
    :link="link"
    :key="i"
    @delete="deleteLink(i)"
    @reorder="reorderLink(i, $event)"/>
  <ClickableSVG
    :width="6"
    icon="add"
    placeholder="v"
    @click.native="addLink"
    class="m-auto"/>
</div>`

type Props = {
  object: Category
}
type Data = {
  svgs: string[]
}
type Methods = {
  addLink(): void
  deleteLink(i: number): void
  reorderLink(i: number, delta: number): void
}
type Computed = {}

const component: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  name: "CategoryEditor",
  components: { LinkEditor, ClickableSVG },
  props: {
    object: {
      type: Object,
      required: true,
    },
  },
  template,
  data() {
    return {
      svgs,
    }
  },
  methods: {
    addLink() {
      this.object.links.push({
        href: "",
        title: "",
      })
    },
    deleteLink(i: number) {
      this.object.links.splice(i, 1)
    },
    reorderLink(i: number, delta: number) {
      let l = this.object.links.length
      let [link] = this.object.links.splice(i, 1)
      i += delta
      i = i < 0 ? 0 : i >= l ? l - 1 : i
      this.object.links.splice(i, 0, link)
    },
  },
}

export default component
