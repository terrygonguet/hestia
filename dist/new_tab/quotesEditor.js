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

  <h2 class="text-center text-accent text-2xl">Quotes</h2>
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
    methods: {},
};
export default component;
