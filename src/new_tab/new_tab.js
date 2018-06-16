require('./new_tab.scss')
const Vue = require('../../node_modules/vue/dist/vue.js')
const fontawesome = require('@fortawesome/fontawesome')
const solid = require('@fortawesome/fontawesome-free-solid')
const uuid = require('uuidv4')

fontawesome.library.add(solid.faUser)

browser.storage.sync.get()
  .then(data => {
    let categories = data.categories || {}

    let app = new Vue({
      el: '#container',
      data: {
        categories,
        customize: {
          isOpen: false,
          selectedCategory: null
        }
      },
      computed: {
        selected () {
          return this.categories[this.customize.selectedCategory]
        }
      },
      methods: {
        fa (...icon) {
          let faIcon = fontawesome.icon(...icon)
          return faIcon ? faIcon.html[0] : 'not found'
        },
        addLink () {
          this.selected.links.push({
            text: 'New item', url: ''
          })
        },
        removeLink (id) {
          this.selected.links.splice(id, 1)
        },
        addCategory () {
          this.$set(this.categories, uuid(), {
            icon: { prefix: 'fas', iconName: 'link' },
            name: 'New category',
            links: []
          })
        },
        removeCategory () {
          if (confirm('You sure ?')) {
            this.$delete(this.categories, this.customize.selectedCategory)
          }
        }
      }
    })

    window.addEventListener('beforeunload', function (event) {
      browser.storage.sync.set({ categories: app.categories })
    })
  })
