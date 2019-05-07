const template = `
<div 
  class="rounded border border-main bg-block relative flex justify-center items-center"
  :style="gridSpan"
>
  <p v-if="!loaded">Loading...</p>
  <div v-else class="absolute h-full p-2 overflow-y-auto">
    <q cite="http://quotes.rest/qod">{{ quote }}</q>
    <p class="text-right text-accent">{{ author }}</p>
  </div>
</div>`;
const component = {
    name: "Category",
    props: {
        id: {
            type: String,
            required: true,
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
    data() {
        return {
            quote: "",
            author: "",
            loaded: false,
        };
    },
    computed: {
        gridSpan() {
            return {
                "grid-column": "span " + this.width,
                "grid-row": "span " + this.height,
            };
        },
    },
    async mounted() {
        let res = await fetch("http://quotes.rest/qod", {
            headers: { Accept: "application/json" },
        });
        let json = await res.json();
        this.quote = json.contents.quotes[0].quote;
        this.author = json.contents.quotes[0].author;
        this.loaded = true;
    },
};
export default component;
export function create() {
    return {
        type: "Quotes",
        id: Date.now()
            .toString(36)
            .substr(2),
        height: 1,
        width: 1,
    };
}
