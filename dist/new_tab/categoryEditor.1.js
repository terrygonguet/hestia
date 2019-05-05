const template = `
<div class="p-4 w-1/4 bg-block border border-main rounded">
  <label class="flex justify-between">
    Title <input v-model="object.title" class="bg-transparent text-right"/>
  </label>
  <label class="flex justify-between">
    Icon <input v-model="object.icon" class="bg-transparent text-right"/>
  </label>
  <label class="flex justify-between">
    Width <input v-model.number="object.width" type="number" min=1 class="w-12 bg-transparent"/>
  </label>
  <label class="flex justify-between">
    Height <input v-model.number="object.height" type="number" min=1 class="w-12 bg-transparent"/>
  </label>
</div>`;
const component = {
    name: "CategoryEditor",
    props: {
        object: {
            type: Object,
            required: true,
        },
    },
    template,
};
export default component;
