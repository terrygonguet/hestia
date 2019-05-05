import { Store } from "vuex"
import { Category } from "./category"
declare const Vuex: { Store: typeof Store }
declare function clone<T>(value: T): T

export interface State {
  config: Config
  widgets: Widget[]
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

export type Widget = Category

export default new Vuex.Store<State>({
  state: {
    config: {
      cols: 6,
      rows: 4,
      colorMain: "#e1e",
      colorAccent: "#1ee",
      colorBg: "#000",
      colorBgBlock: "#111",
      colorBorder: "#1ee",
    },
    widgets: [],
  },
  mutations: {
    addWidget(state) {
      state.widgets.push({
        type: "Category",
        icon: "aperture",
        id: Date.now()
          .toString(36)
          .substr(2),
        links: [],
        title: "Untitled",
        height: 1,
        width: 1,
      })
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
      let data = await browser.storage.local.get(["config", "widgets"])
      Object.assign(state.config, data.config)
      state.widgets = data.widgets || []
    },

    async persist({ state }) {
      await browser.storage.local.set(clone(state))
    },
  },
})
