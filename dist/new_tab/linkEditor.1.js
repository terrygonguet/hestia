const template = `
<div class="flex flex-row justify-center">
  <div class="flex flex-col flex-grow">
    <input v-model="link.title" class="bg-transparent" placeholder="Title"/>
    <input v-model="link.href" class="bg-transparent" placeholder="URL"/>
  </div>
  <div class="flex flex-col justify-center">
    <object 
      type="image/svg+xml"
      :data="'../resources/svg/chevron-up.svg'"
      class="inline w-4 cursor-pointer"
      @click="$emit('reorder', -1)"
    >^</object>
    <object 
      type="image/svg+xml"
      :data="'../resources/svg/chevron-down.svg'"
      class="inline w-4 cursor-pointer"
      @click="$emit('reorder', 1)"
    >v</object>
  </div>
  <object
    type="image/svg+xml"
    :data="'../resources/svg/bin.svg'"
    class="w-6 cursor-pointer"
    @click="$emit('delete')"
  >v</object>
</div>`;
const component = {
    name: "LinkEditor",
    props: {
        link: {
            type: Object,
            required: true,
        },
    },
    template,
};
export default component;
