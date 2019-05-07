import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"

const template = `
<div 
  class="rounded border border-main p-2 bg-block flex flex-col"
  :style="gridSpan"
>
  <h2 class="text-accent text-2xl">
    <img
      alt="📁"
      :src="'../resources/svg/' + icon + '.svg'"
      class="inline"
    />
    {{ title }}
  </h2>
  <a
    v-for="link in links"
    :href="link.href"
  >
    {{ link.title }}
    <span
      v-if="link.hotkey"
      class="text-sm border rounded border-gray-500 text-accent px-1"
    >{{ link.hotkey }}</span>
  </a>
  <div 
    v-if="!links.length" 
    class="flex-grow flex justify-center items-center text-gray-500"
  >
    Double click to edit
  </div>
</div>`

export interface Category {
  type: "Category"
  id: string
  title: string
  icon: string
  links: Link[]
  width: number
  height: number
}

export interface Link {
  href: string
  title: string
  hotkey?: string
}

type Props = {
  id: string
  title: string
  links: Link[]
  icon: string
  width: number
  height: number
}
type Data = {}
type Methods = {
  hotkeyHandler(e: KeyboardEvent): void
}
type Computed = {
  gridSpan: object
}

const component: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  name: "Category",
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
    },
    links: {
      type: Array,
      default: [],
    },
    icon: {
      type: String,
      default: "anchor",
    },
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
  },
  template,
  computed: {
    gridSpan() {
      return {
        "grid-column": "span " + this.width,
        "grid-row": "span " + this.height,
      }
    },
  },
  methods: {
    hotkeyHandler(e) {
      if (e.target != document.body) return
      for (const link of this.links) {
        if (link.hotkey == e.key) {
          location.replace(link.href)
          return
        }
      }
    },
  },
  mounted() {
    window.addEventListener("keydown", this.hotkeyHandler)
  },
  destroyed() {
    window.removeEventListener("keydown", this.hotkeyHandler)
  },
}

export default component

export function create(): Category {
  return {
    type: "Category",
    icon: "aperture",
    id: Date.now()
      .toString(36)
      .substr(2),
    links: [],
    title: "Untitled",
    height: 1,
    width: 1,
  }
}
