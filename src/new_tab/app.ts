import { Config, Widget } from "./store.js"
import Category from "./category.js"
import CategoryEditor from "./categoryEditor.js"
import ClickableSVG from "./clickableSVG.js"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"
import Vue from "vue"

const template = `
<div class="p-24 h-screen flex flex-col items-center font-sans bg text-main" :style="cssVars">
  <h1 class="text-4xl font-bold mb-4 text-accent">Welcome back!</h1>
  <div id="categories" class="flex-grow w-full">
    <component
      v-for="w in widgets"
      :key="w.id"
      :is="w.type"
      v-bind="w"
      @dblclick.native.prevent="openEditor(w)"/>
    <div class="rounded border border-main p-2 bg-block flex justify-center items-center">
      <ClickableSVG
        :width="10"
        icon="add"
        placeholder="+"
        @click.native="addWidget"/>
    </div>
  </div>
  <div
    v-if="editable" 
    class="absolute inset-0 h-screen flex justify-center items-center bg-transparent-black"
    @click.self="closeEditor"
  >
    <component 
      :is="editable.type + 'Editor'" 
      :object="editable"
      class="opacity-100"
      @delete="deleteWidget(editable.id)"
      @reorder="reorderWidget(editable.id, $event)"/>
  </div>
</div>`

type Props = {}
type Data = {
  editable?: Widget
}
type Methods = {
  openEditor(widget: Widget): void
  closeEditor(): void
  addWidget(): void
  deleteWidget(id: string): void
  reorderWidget(id: string, delta: number): void
}
type Computed = {
  cssVars: object
  config: Config
  widgets: Widget[]
}

const component: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  name: "App",
  components: {
    Category,
    CategoryEditor,
    ClickableSVG,
  },
  template,
  data() {
    return {
      editable: undefined,
    }
  },
  computed: {
    cssVars() {
      return {
        "--nb-columns": this.config.cols,
        "--nb-rows": this.config.rows,
        "--bg": this.config.colorBg,
        "--block-bg": this.config.colorBgBlock,
        "--color-main": this.config.colorMain,
        "--color-accent": this.config.colorAccent,
        "--border": this.config.colorBorder,
      }
    },
    config() {
      return this.$store.state.config
    },
    widgets() {
      return this.$store.state.widgets
    },
  },
  methods: {
    openEditor(widget: Widget) {
      this.editable = widget
    },
    closeEditor() {
      this.editable = undefined
    },
    addWidget() {
      this.$store.commit("addWidget")
    },
    deleteWidget(id: string) {
      this.$store.commit("deleteWidget", id)
      this.closeEditor()
    },
    reorderWidget(id: string, delta: number) {
      this.$store.commit("reorderWidget", { id, delta })
    },
  },
}

export default component
