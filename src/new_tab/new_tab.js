import interact from 'interactjs'
import './new_tab.scss'
import Vue from 'vue/dist/vue'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import uuid from 'uuidv4'
import _values from 'lodash/values'
import _sortBy from 'lodash/sortBy'

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
          selectedCategory: Object.keys(categories)[0],
          x: innerWidth / 4,
          y: innerHeight / 2
        }
      },
      mounted () {
        this.$el.style.visibility = 'visible'
      },
      computed: {
        selected () {
          return this.categories[this.customize.selectedCategory]
        },
        openCloseIcon () {
          return this.customize.isOpen ? 'times' : 'list'
        },
        sortedCategories () {
          return _sortBy(_values(this.categories), 'order')
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
          let id = uuid()
          this.$set(this.categories, id, {
            id,
            icon: { prefix: 'fas', iconName: 'link' },
            name: 'New category',
            links: [],
            width: 1,
            height: 1,
            order: Object.keys(this.categories).length + 1
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

    interact('#customize')
      .draggable({
        onmove: e => {
          app.customize.x += e.dx
          app.customize.y += e.dy
        },
        allowFrom: '.drag-handle'
      })
  })
