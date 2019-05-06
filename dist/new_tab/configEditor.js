import ClickableSVG from "./clickableSVG.js";
const template = `
<div class="p-4 w-1/4 bg-block border border-main rounded flex flex-col justify-center">
  <label class="flex justify-between">
    Number of Colums <input v-model.number="config.cols" type="number" min="1" class="w-12 bg-transparent"/>
  </label>
  <label class="flex justify-between">
    Number of Rows <input v-model.number="config.rows" type="number" min="1" class="w-12 bg-transparent"/>
  </label>
  <label class="flex justify-between">
    Main text color <input v-model.number="config.colorMain" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between">
    Accented text color <input v-model.number="config.colorAccent" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between">
    Background color <input v-model.number="config.colorBg" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between">
    Widget background color <input v-model.number="config.colorBgBlock" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between">
    Border color <input v-model.number="config.colorBorder" type="color" class="bg-transparent"/>
  </label>
</div>`;
const component = {
    name: "ConfigEditor",
    components: { ClickableSVG },
    template,
    computed: {
        config() {
            return this.$store.state.config;
        },
    },
};
export default component;
