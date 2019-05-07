import { create as createCategory } from "./category.js";
import { create as createTextZone } from "./textZone.js";
const creators = {
    Category: createCategory,
    TextZone: createTextZone,
};
const template = `
<div
  class="rounded border border-main p-2 bg-block cursor-pointer flex flex-col justify-evenly items-center hover:opacity-100"
  :class="[nbWidgets >= 2 ? 'opacity-0' : '']"
>
  <h1 class="text-accent text-2xl">Create new</h1>
  <button @click="addWidget('Category')" class="border border-main rounded px-2 py-1 m-1">Category</button>
  <button @click="addWidget('TextZone')" class="border border-main rounded px-2 py-1 m-1">TextZone</button>
</div>`;
const component = {
    name: "NewWidget",
    template,
    computed: {
        nbWidgets() {
            return this.$store.state.widgets.length;
        },
    },
    methods: {
        addWidget(name) {
            this.$store.commit("addWidget", creators[name]);
        },
    },
};
export default component;
