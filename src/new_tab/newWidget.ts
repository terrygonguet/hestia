import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"
import { create as createCategory } from "./category.js"
import { create as createTextZone } from "./textZone.js"
import { create as createQuotes } from "./quotes.js"
import { create as createTabCounter } from "./tabCounter.js"

const creators = {
  Category: createCategory,
  TextZone: createTextZone,
  Quotes: createQuotes,
  TabCounter: createTabCounter,
}

const template = `
<div
  class="rounded border border-main p-2 bg-block cursor-pointer flex flex-col justify-evenly items-center hover:opacity-100"
  :class="[nbWidgets >= 2 ? 'opacity-0' : '']"
>
  <h1 class="text-accent text-2xl">Create new</h1>
  <button @click="addWidget('Category')" class="border border-main rounded px-2 py-1 m-1">Category</button>
  <button @click="addWidget('TextZone')" class="border border-main rounded px-2 py-1 m-1">Text Zone</button>
  <button @click="addWidget('TabCounter')" class="border border-main rounded px-2 py-1 m-1">Tab Counter</button>
  <button @click="addWidget('Quotes')" class="border border-main rounded px-2 py-1 m-1">Quotes</button>
</div>`

type Props = {}
type Data = {}
type Methods = {
  addWidget(name: keyof typeof creators): void
}
type Computed = {
  nbWidgets: number
}

const component: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  name: "NewWidget",
  template,
  computed: {
    nbWidgets() {
      return this.$store.state.widgets.length
    },
  },
  methods: {
    addWidget(name: keyof typeof creators) {
      this.$store.commit("addWidget", creators[name])
    },
  },
}

export default component
