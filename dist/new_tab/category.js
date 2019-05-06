const template = `
<div 
  class="rounded border border-main p-2 bg-block flex flex-col"
  :style="gridSpan"
>
  <h2 class="text-accent text-2xl">
    <img
      alt="📁"
      :src="'../resources/svg/' + icon + '.svg'"
      class="inline"
    />
    {{ title }}
  </h2>
  <a
    v-for="link in links"
    :href="link.href"
  >{{ link.title }}</a>
  <div 
    v-if="!links.length" 
    class="flex-grow flex justify-center items-center text-gray-500"
  >
    Double click to edit
  </div>
</div>`;
const component = {
    name: "Category",
    props: {
        id: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: "Untitled",
        },
        links: {
            type: Array,
            default: [],
        },
        icon: {
            type: String,
            default: "anchor",
        },
        width: {
            type: Number,
            default: 1,
        },
        height: {
            type: Number,
            default: 1,
        },
    },
    template,
    computed: {
        gridSpan() {
            return {
                "grid-column": "span " + this.width,
                "grid-row": "span " + this.height,
            };
        },
    },
};
export default component;
