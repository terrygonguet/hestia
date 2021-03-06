import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"

const template = `
<div
  class="rounded border border-main p-2 bg-block flex flex-col justify-center items-center text-center"
  :style="gridSpan"
  >
  <p class="my-2">
    <span class="text-accent text-xl font-semibold">{{ counters.today }}</span>
    <br/>
    new tabs today
  </p>
  <p class="my-2">
    <span class="text-accent text-xl font-semibold">{{ counters.allTime }}</span>
    <br/>
    new tabs since
    <br/>
    {{ sinceDate }}
  </p>
</div>`

export interface TabCounter {
  type: "TabCounter"
  id: string
  counters: {
    today: number
    allTime: number
  }
  since: number
  lastAdd: number
  width: number
  height: number
}

type Props = {
  id: string
  width: number
  height: number
  counters: {
    today: number
    allTime: number
  }
  since: number
  lastAdd: number
}
type Data = {
  dateFormatter: Intl.DateTimeFormat
}
type Methods = {}
type Computed = {
  gridSpan: object
  sinceDate: string
}

const component: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  name: "TabCounter",
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
    counters: {
      type: Object,
      default: () => ({ allTime: 0, today: 0 }),
    },
    since: {
      type: Number,
      default: Date.now,
    },
    lastAdd: {
      type: Number,
      default: Date.now,
    },
  },
  template,
  data() {
    return {
      dateFormatter: new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    }
  },
  computed: {
    gridSpan() {
      return {
        "grid-column": "span " + this.width,
        "grid-row": "span " + this.height,
      }
    },
    sinceDate() {
      return this.dateFormatter.format(this.since)
    },
  },
}

export default component

export function create(): TabCounter {
  return {
    type: "TabCounter",
    id: Date.now()
      .toString(36)
      .substr(2),
    height: 1,
    width: 1,
    counters: {
      allTime: 0,
      today: 0,
    },
    since: Date.now(),
    lastAdd: Date.now(),
  }
}
