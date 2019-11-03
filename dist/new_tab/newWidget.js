import { create as createCategory } from "./category.js";
import { create as createTextZone } from "./textZone.js";
import { create as createQuotes } from "./quotes.js";
import { create as createTabCounter } from "./tabCounter.js";
import { create as createClock } from "./clock.js";
const creators = {
    Category: createCategory,
    TextZone: createTextZone,
    Quotes: createQuotes,
    TabCounter: createTabCounter,
    Clock: createClock,
};
const template = `
<div
  class="rounded border border-main p-2 bg-block cursor-pointer hover:opacity-100"
  :class="[nbWidgets >= 2 ? 'opacity-0' : '']"
  :style="gridStyles"
>
  <h1 class="text-accent text-xl text-center" style="grid-column:span 2">Create new</h1>
  <button @click="addWidget('Category')" class="border border-main rounded">Category</button>
  <button @click="addWidget('Clock')" class="border border-main rounded">Clock</button>
  <button @click="addWidget('TextZone')" class="border border-main rounded">Text Zone</button>
  <button @click="addWidget('TabCounter')" class="border border-main rounded">Tab Counter</button>
  <button @click="addWidget('Quotes')" class="border border-main rounded">Quotes</button>
</div>`;
const component = {
    name: "NewWidget",
    template,
    computed: {
        nbWidgets() {
            return this.$store.state.widgets.length;
        },
        gridStyles() {
            return {
                display: "grid",
                "grid-template-columns": "1fr 1fr",
                "grid-gap": "0.5rem",
            };
        },
    },
    methods: {
        addWidget(name) {
            this.$store.commit("addWidget", creators[name]);
        },
    },
};
export default component;
