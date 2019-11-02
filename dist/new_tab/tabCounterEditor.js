import ClickableSVG from "./clickableSVG.js";
const template = `
<div class="p-4 w-1/2 bg-block border border-main rounded flex flex-col justify-center">
  <div class="flex flex-row justify-around">
    <div>
      <ClickableSVG
        :width="6"
        icon="chevron-left"
        placeholder="<"
        @click.native="$emit('reorder', -1)"/>
      <ClickableSVG
        :width="6"
        icon="chevron-right"
        placeholder=">"
        @click.native="$emit('reorder', 1)"/>
    </div>
    <ClickableSVG
      :width="6"
      icon="bin"
      placeholder="X"
      @click.native="$emit('delete')"/>
  </div>

  <h2 class="text-center text-accent text-2xl">Tab Counter</h2>
  
  <label class="flex justify-between text-accent">
    Width <input v-model.number="object.width" type="number" min="1" class="w-12 bg-transparent text-main"/>
  </label>
  <label class="flex justify-between text-accent">
    Height <input v-model.number="object.height" type="number" min="1" class="w-12 bg-transparent text-main"/>
  </label>
  <label class="flex justify-between text-accent">
    Today <input v-model.number="object.counters.today" type="number" min="0" class="w-12 bg-transparent text-main"/>
  </label>
  <label class="flex justify-between text-accent">
    All Time <input v-model.number="object.counters.allTime" type="number" min="0" class="w-12 bg-transparent text-main"/>
  </label>
  <div class="text-center">
    <button class="border border-main rounded px-4 py-2 m-2" @click="reset">Reset</button>
  </div>
</div>`;
const component = {
    name: "CategoryEditor",
    components: { ClickableSVG },
    props: {
        object: {
            type: Object,
            required: true,
        },
    },
    template,
    methods: {
        reset() {
            if (confirm("Are you sure ?")) {
                this.object.counters.allTime = this.object.counters.today = 0;
                this.object.since = this.object.lastAdd = Date.now();
            }
        },
    },
};
export default component;
