const template = `
<div class="cursor-pointer inline-flex">
  <object 
    type="image/svg+xml"
    :data="'../resources/svg/' + icon + '.svg'"
    :class="['pointer-none', 'w-' + width]"
  >{{ placeholder }}</object>
</div>`;
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
