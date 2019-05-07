import Category, { create as createCategory } from "./category.js";
import CategoryEditor from "./categoryEditor.js";
import ConfigEditor from "./configEditor.js";
import Title from "./title.js";
import TitleWidgetEditor from "./titleEditor.js";
import TextZone, { create as createTextZone } from "./textZone.js";
import TextZoneEditor from "./textZoneEditor.js";
import ClickableSVG from "./clickableSVG.js";
const creators = {
    Category: createCategory,
    TextZone: createTextZone,
};
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

    <div
      class="rounded border border-main p-2 bg-block cursor-pointer flex flex-col justify-evenly items-center hover:opacity-100"
      :class="[widgets.length >= 2 ? 'opacity-0' : '']"
    >
      <h1 class="text-accent text-2xl">Create</h1>
      <button @click="addWidget('Category')" class="border border-main rounded px-2 py-1 m-1">Category</button>
      <button @click="addWidget('TextZone')" class="border border-main rounded px-2 py-1 m-1">TextZone</button>
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

</div>`;
const component = {
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
    },
    template,
    data() {
        return {
            editable: undefined,
            editorType: "",
        };
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
            };
        },
        config() {
            return this.$store.state.config;
        },
        widgets() {
            return this.$store.state.widgets;
        },
        titleWidget() {
            return this.$store.state.titleWidget;
        },
        showEditor() {
            return !!this.editorType;
        },
    },
    methods: {
        openWidgetEditor(widget) {
            this.editable = widget;
            this.editorType = widget.type + "Editor";
        },
        openConfigEditor() {
            this.editorType = "ConfigEditor";
        },
        openTitleEditor() {
            this.editorType = "TitleWidgetEditor";
        },
        closeEditor() {
            this.editable = undefined;
            this.editorType = "";
        },
        addWidget(name) {
            this.$store.commit("addWidget", creators[name]);
            this.openWidgetEditor(this.widgets[this.widgets.length - 1]);
        },
        deleteWidget(id) {
            this.$store.commit("deleteWidget", id);
            this.closeEditor();
        },
        reorderWidget(id, delta) {
            this.$store.commit("reorderWidget", { id, delta });
        },
    },
};
export default component;
