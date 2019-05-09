import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"

const template = `
<div 
  class="rounded border border-main bg-block relative flex justify-center items-center"
  :style="gridSpan"
>
  <p v-if="!loaded">Loading...</p>
  <div v-else class="absolute h-full p-2 overflow-y-auto">
    <q cite="http://quotes.rest/qod">{{ quote }}</q>
    <p class="text-right text-accent">{{ author }}</p>
  </div>
</div>`

export interface Quotes {
  type: "Quotes"
  id: string
  width: number
  height: number
  cache: Cache
}

interface Cache {
  quote?: string
  author?: string
  date: number
}

type Props = {
  id: string
  width: number
  height: number
  cache: Cache
}
type Data = {
  quote: string
  author: string
  loaded: boolean
}
type Methods = {}
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
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
    cache: {
      type: Object,
      default: () => ({ date: 0 }),
    },
  },
  template,
  data() {
    let hasCache = Boolean(
      this.cache.quote &&
        this.cache.author &&
        Date.now() - this.cache.date < 3 * 60 * 1000,
    )
    return {
      quote: this.cache.quote || "",
      author: this.cache.author || "",
      loaded: hasCache,
    }
  },
  computed: {
    gridSpan() {
      return {
        "grid-column": "span " + this.width,
        "grid-row": "span " + this.height,
      }
    },
  },
  async mounted() {
    if (this.loaded) return

    let res = await fetch("http://quotes.rest/qod", {
      headers: { Accept: "application/json" },
    })
    let json = await res.json()
    this.quote = json.contents.quotes[0].quote
    this.author = json.contents.quotes[0].author
    this.loaded = true
    this.cache.quote = this.quote
    this.cache.author = this.author
    this.cache.date = Date.now()
  },
}

export default component

export function create(): Quotes {
  return {
    type: "Quotes",
    id: Date.now()
      .toString(36)
      .substr(2),
    height: 1,
    width: 1,
    cache: {
      date: 0,
    },
  }
}
