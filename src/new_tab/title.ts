import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"

const template = `
<h1 class="text-4xl font-bold mb-4 text-accent" v-html="content || 'empty'"></h1>`

export type TitleWidget = Message | List | Quote | Clock

interface Message {
  type: "Message"
  message: string
}

interface List {
  type: "List"
  messages: string[]
}

interface Quote {
  type: "Quote"
}

interface Clock {
  type: "Clock"
}

type Props = {
  type: string
  message: string
  messages: string[]
}
type Data = {
  time: number
  quote: string
}
type Methods = {}
type Computed = {
  content: string
}

const component: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  name: "TitleWidget",
  props: {
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "Where to?",
    },
    messages: {
      type: Array,
      default: ["Double click me", "Edit me"],
    },
  },
  template,
  data() {
    return {
      time: Date.now(),
      quote: "Loading...",
    }
  },
  computed: {
    content() {
      switch (this.type) {
        case "Message":
          return this.message
        case "List":
          return this.messages[Math.floor(Math.random() * this.messages.length)]
        case "Clock":
          return new Intl.DateTimeFormat().format(this.time)
        case "Quote":
          return this.quote
        default:
          return "Wat"
      }
    },
  },
  methods: {},
}

export default component
