const template = `
<img
  :src="'../resources/svg/' + icon + '.svg'"
  :class="['w-' + width]"
  class="cursor-pointer inline-flex stroke-current"
  :alt="placeholder"
/>`;
const component = {
    name: "ClickableSVG",
    props: {
        width: {
            type: Number,
            default: 6,
        },
        icon: {
            type: String,
            default: "anchor",
        },
        placeholder: {
            type: String,
            default: "",
        },
    },
    template,
};
export default component;
