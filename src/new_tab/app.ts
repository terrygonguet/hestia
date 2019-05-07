import { Config, Widget } from "./store.js"
import Category from "./category.js"
import CategoryEditor from "./categoryEditor.js"
import ConfigEditor from "./configEditor.js"
import ClickableSVG from "./clickableSVG.js"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"
import Vue from "vue"

const template = `
<div class="p-24 h-screen flex flex-col items-center font-sans bg text-main" :style="cssVars">

  <h1 class="text-4xl font-bold mb-4 text-accent">Welcome back!</h1>

  <div id="categories" class="flex-grow w-full">
    <component
      v-for="widget in widgets"
      :key="widget.id"
      :is="widget.type"
      v-bind="widget"
      @dblclick.native.prevent="openWidgetEditor(widget)"/>

    <div
      class="rounded border border-main p-2 bg-block cursor-pointer flex justify-center items-center hover:opacity-100"
      :class="[widgets.length >= 2 ? 'opacity-0' : '']"
      @click="addWidget"
    >
      <ClickableSVG
        :width="10"
        icon="add"
        placeholder="+"/>
    </div>

  </div>

  <div
    v-if="showEditor"
    class="absolute inset-0 h-screen flex justify-center items-center bg-transparent-black"
    @click.self="closeEditor"
  >
    <component
      :is="editorType"
      :object="editable"
      class="opacity-100"
      @delete="deleteWidget(editable.id)"
      @reorder="reorderWidget(editable.id, $event)"/>
  </div>

  <ClickableSVG
    :width="8"
    icon="settings"
    placeholder="Settings"
    @click.native="openConfigEditor"
    class="absolute top-0 right-0 m-4"/>

</div>`

type Props = {}
type Data = {
  editable?: Widget
  showConfigEditor: boolean
}
type Methods = {
  openWidgetEditor(widget: Widget): void
  openConfigEditor(): void
  closeEditor(): void
  addWidget(): void
  deleteWidget(id: string): void
  reorderWidget(id: string, delta: number): void
}
type Computed = {
  cssVars: object
  config: Config
  widgets: Widget[]
  editorType: string
  showEditor: boolean
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
    ConfigEditor,
    ClickableSVG,
  },
  template,
  data() {
    return {
      editable: undefined,
      showConfigEditor: false,
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
    editorType() {
      if (this.showConfigEditor) return "ConfigEditor"
      else return this.editable ? this.editable.type + "Editor" : ""
    },
    showEditor() {
      return !!this.editable || this.showConfigEditor
    },
  },
  methods: {
    openWidgetEditor(widget: Widget) {
      this.editable = widget
    },
    openConfigEditor() {
      this.showConfigEditor = true
    },
    closeEditor() {
      this.editable = undefined
      this.showConfigEditor = false
    },
    addWidget() {
      this.$store.commit("addWidget")
      this.openWidgetEditor(this.widgets[this.widgets.length - 1])
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
