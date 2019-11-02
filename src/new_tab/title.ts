import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"

const template = `
<h1 class="text-4xl font-bold mb-4 text-accent" v-html="content || '-'"></h1>`

export type TitleWidget = Message | List | Clock

interface Message {
  type: "Message"
  message: string
}

interface List {
  type: "List"
  messages: string[]
}

interface Clock {
  type: "Clock"
  hour12: boolean
  locale: string
}

type Props = {
  type: string
  message: string
  messages: string[]
  hour12?: boolean
  locale?: string
}
type Data = {
  time: number
}
type Methods = {}
type Computed = {
  content: string
  dateFormatter: Intl.DateTimeFormat
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
    hour12: {
      type: Boolean,
    },
    locale: {
      type: String,
    },
  },
  template,
  data() {
    return {
      time: Date.now(),
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
          return this.dateFormatter.format(this.time)
        default:
          return "Wat"
      }
    },
    dateFormatter() {
      return new Intl.DateTimeFormat(this.locale || "default", {
        hour12: this.hour12,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    },
  },
  mounted() {
    setInterval(() => (this.time = Date.now()), 1000)
  },
}

export default component
