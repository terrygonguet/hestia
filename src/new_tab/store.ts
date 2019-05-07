import { Store } from "vuex"
import { Category } from "./category"
import { TitleWidget } from "./title"
import { TextZone } from "./textZone"
declare const Vuex: { Store: typeof Store }
declare function clone<T>(value: T): T

export interface State {
  config: Config
  widgets: Widget[]
  titleWidget: TitleWidget
}

export interface Config {
  cols: number
  rows: number
  colorMain: string
  colorAccent: string
  colorBg: string
  colorBgBlock: string
  colorBorder: string
}

export type Widget = Category | TextZone

export default new Vuex.Store<State>({
  state: {
    config: {
      cols: 6,
      rows: 4,
      colorMain: "#000000",
      colorAccent: "#35acce",
      colorBg: "#ffffff",
      colorBgBlock: "#ffffff",
      colorBorder: "#454545",
    },
    widgets: [],
    titleWidget: {
      type: "Message",
      message: "Double click me!",
      messages: ["Enter to add"],
    },
  },
  mutations: {
    addWidget(state, create: () => Widget) {
      state.widgets.push(create())
    },
    deleteWidget(state, id: string) {
      state.widgets.splice(state.widgets.findIndex(w => w.id == id), 1)
    },
    reorderWidget(state, { id, delta }: { id: string; delta: number }) {
      let l = state.widgets.length
      let i = state.widgets.findIndex(w => w.id == id)
      let [widget] = state.widgets.splice(i, 1)
      i += delta
      i = i < 0 ? 0 : i >= l ? l - 1 : i
      state.widgets.splice(i, 0, widget)
    },
  },
  actions: {
    async restore({ state }) {
      let data = await browser.storage.local.get(undefined)
      Object.assign(state.config, data.config)
      Object.assign(state.titleWidget, data.titleWidget)
      state.widgets = data.widgets || []
    },

    async persist({ state }) {
      await browser.storage.local.set(clone(state))
    },
  },
})
