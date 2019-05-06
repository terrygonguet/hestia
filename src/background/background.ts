browser.runtime.onInstalled.addListener(e => {
  let { reason, temporary } = e
  console.log("OnInstall :", e)
})
