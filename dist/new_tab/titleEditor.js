import ClickableSVG from "./clickableSVG.js";
const template = `
<div class="p-4 w-1/3 bg-block border border-main rounded flex flex-col justify-center">
  <label class="flex justify-between text-accent">
    Type
    <select v-model="widget.type" class="bg-transparent text-right text-main">
      <option value="Message">Message</option>
      <option value="List">List</option>
      <option value="Quote">Quote</option>
      <option value="Clock">Clock</option>
    </select>
  </label>

  <label class="flex justify-between text-accent" v-if="widget.type == 'Message'">
    Message
    <input v-model="widget.message" class="bg-transparent text-right text-main"/>
  </label>

  <div v-if="widget.type == 'List'" class="flex flex-col">
    <input
      v-for="(message, i) in widget.messages"
      v-model="widget.messages[i]"
      class="bg-transparent w-full"
      placeholder="Backspace to remove"
      :autofocus="i == widget.messages.length - 1"
      @keydown.enter="addMessage"
      @keydown.backspace="removeMessage(i)"
      ref="messages"/>
  </div>
</div>`;
const component = {
    name: "TitleWidgetEditor",
    components: { ClickableSVG },
    template,
    data() {
        return {};
    },
    computed: {
        widget() {
            return this.$store.state.titleWidget;
        },
    },
    methods: {
        addMessage() {
            if (this.widget.type != "List")
                return;
            this.widget.messages.push("A nice message");
            this.focusLast();
        },
        removeMessage(i) {
            let widget = this.widget;
            if (widget.type != "List" || !widget.messages)
                return;
            let messages = widget.messages;
            if (messages[i].length != 0)
                return;
            if (messages.length != 1)
                messages.splice(i, 1);
            this.focusLast(true);
        },
        async focusLast(focus = false) {
            await this.$nextTick();
            let inputs = this.$refs.messages;
            inputs[inputs.length - 1][focus ? "focus" : "select"]();
        },
    },
};
export default component;
