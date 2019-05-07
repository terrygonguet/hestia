import Vue from "vue"
import ClickableSVG from "./clickableSVG.js"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"
import { Config } from "./store.js"

const template = `
<div class="p-4 w-1/3 bg-block border border-main rounded flex flex-col justify-center">
  <h2 class="text-center text-accent text-2xl">Settings</h2>

  <label class="flex justify-between text-accent">
    Number of Colums <input v-model.number="config.cols" type="number" min="1" class="w-12 bg-transparent text-main"/>
  </label>
  <label class="flex justify-between text-accent">
    Number of Rows <input v-model.number="config.rows" type="number" min="1" class="w-12 bg-transparent text-main"/>
  </label>
  <label class="flex justify-between text-accent">
    Main text color <input v-model.number="config.colorMain" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between text-accent">
    Accented text color <input v-model.number="config.colorAccent" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between text-accent">
    Background color <input v-model.number="config.colorBg" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between text-accent">
    Widget background color <input v-model.number="config.colorBgBlock" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between text-accent">
    Border color <input v-model.number="config.colorBorder" type="color" class="bg-transparent"/>
  </label>
</div>`

type Props = {}
type Data = {}
type Methods = {}
type Computed = {
  config: Config
}

const component: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  name: "ConfigEditor",
  components: { ClickableSVG },
  template,
  computed: {
    config() {
      return this.$store.state.config
    },
  },
}

export default component
