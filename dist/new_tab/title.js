const template = `
<h1 class="text-4xl font-bold mb-4 text-accent" v-html="content || 'empty'"></h1>`;
const component = {
    name: "TitleWidget",
    props: {
        type: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            default: "Where to?",
        },
        messages: {
            type: Array,
            default: ["Double click me", "Edit me"],
        },
    },
    template,
    data() {
        return {
            time: Date.now(),
            quote: "Loading...",
        };
    },
    computed: {
        content() {
            switch (this.type) {
                case "Message":
                    return this.message;
                case "List":
                    return this.messages[Math.floor(Math.random() * this.messages.length)];
                case "Clock":
                    return new Intl.DateTimeFormat().format(this.time);
                case "Quote":
                    return this.quote;
                default:
                    return "Wat";
            }
        },
    },
    methods: {},
};
export default component;
