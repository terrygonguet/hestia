var categories;

browser.storage.sync.get()
.then(data => {
  categories = data.categories || {};
});