(async function () {
  let data = await browser.storage.sync.get()
  if (!data.categories) {
    await browser.storage.sync.set({ categories: {} })
  }
  if (!data.css) {
    await browser.storage.sync.set({ css: `body {
  background: #111;
  color: #999;
  font-family: Verdana;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.category {
  background: #222;
  border: 1px solid #000;
  border-radius: 3px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.category-header {
  font-weight: bold;
  font-size: 1.2em;
  margin: 5px;
}

.link {
  text-decoration: none;
  color: #F62217;
  display: table-row;
}

.shortcut {
  color: #EEEEEEC0;
  border: 1px solid #EEEEEE40;
  padding: 2px;
  font-size: 80%;
  border-radius: 3px;
}`
    })
  }
})()
