import Category from "./category.js";
import CategoryEditor from "./categoryEditor.js";
import ConfigEditor from "./configEditor.js";
import ClickableSVG from "./clickableSVG.js";
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
      class="rounded border border-main p-2 bg-block cursor-pointer flex justify-center items-center opacity-25 hover:opacity-100"
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

</div>`;
const component = {
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
        editorType() {
            if (this.showConfigEditor)
                return "ConfigEditor";
            else
                return this.editable ? this.editable.type + "Editor" : "";
        },
        showEditor() {
            return !!this.editable || this.showConfigEditor;
        },
    },
    methods: {
        openWidgetEditor(widget) {
            this.editable = widget;
        },
        openConfigEditor() {
            this.showConfigEditor = true;
        },
        closeEditor() {
            this.editable = undefined;
            this.showConfigEditor = false;
        },
        addWidget() {
            this.$store.commit("addWidget");
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
    mounted() {
        window.addEventListener("keydown", e => {
            for (const widget of this.widgets) {
                if (widget.type == "Category") {
                    for (const link of widget.links) {
                        if (link.hotkey == e.key) {
                            location.replace(link.href);
                            return;
                        }
                    }
                }
            }
        });
    },
};
export default component;
