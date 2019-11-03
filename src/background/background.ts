import { Widget } from "../new_tab/store"

browser.runtime.onInstalled.addListener(e => {
  let { reason, temporary } = e
  console.log("OnInstall :", e)
})

browser.tabs.onCreated.addListener(async tab => {
  let { widgets } = await browser.storage.local.get("widgets")

  for (const widget of widgets as Widget[]) {
    if (widget.type != "TabCounter") continue

    let then = new Date(widget.lastAdd),
      now = new Date()
    // if it's a new day reset day counter
    if (then.getDate() != now.getDate()) widget.counters.today = 1
    else widget.counters.today++

    widget.counters.allTime++
    widget.lastAdd = Date.now()
  }

  await browser.storage.local.set({ widgets })
})
