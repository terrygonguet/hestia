import { Config, Widget } from "./store.js"
import Category from "./category.js"
import CategoryEditor from "./categoryEditor.js"
import ConfigEditor from "./configEditor.js"
import Title from "./title.js"
import TitleWidgetEditor from "./titleEditor.js"
import TextZone from "./textZone.js"
import TextZoneEditor from "./textZoneEditor.js"
import ClickableSVG from "./clickableSVG.js"
import NewWidget from "./newWidget.js"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"
import Vue from "vue"

const template = `
<div class="p-24 h-screen flex flex-col items-center font-sans bg text-main" :style="cssVars">

  <Title v-bind="titleWidget" @dblclick.native.prevent="openTitleEditor"/>

  <div id="categories" class="flex-grow w-full">
    <component
      v-for="widget in widgets"
      :key="widget.id"
      :is="widget.type"
      v-bind="widget"
      @dblclick.native.prevent="openWidgetEditor(widget)"/>
    <NewWidget/>
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
  editorType: string
}
type Methods = {
  openWidgetEditor(widget: Widget): void
  openConfigEditor(): void
  openTitleEditor(): void
  closeEditor(): void
  deleteWidget(id: string): void
  reorderWidget(id: string, delta: number): void
}
type Computed = {
  cssVars: object
  config: Config
  widgets: Widget[]
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
    Title,
    TitleWidgetEditor,
    TextZone,
    TextZoneEditor,
    ConfigEditor,
    ClickableSVG,
    NewWidget,
  },
  template,
  data() {
    return {
      editable: undefined,
      editorType: "",
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
    titleWidget() {
      return this.$store.state.titleWidget
    },
    showEditor() {
      return !!this.editorType
    },
  },
  methods: {
    openWidgetEditor(widget: Widget) {
      this.editable = widget
      this.editorType = widget.type + "Editor"
    },
    openConfigEditor() {
      this.editorType = "ConfigEditor"
    },
    openTitleEditor() {
      this.editorType = "TitleWidgetEditor"
    },
    closeEditor() {
      this.editable = undefined
      this.editorType = ""
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
