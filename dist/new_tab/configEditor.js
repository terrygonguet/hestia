import ClickableSVG from "./clickableSVG.js";
const template = `
<div class="p-4 w-1/3 bg-block border border-main rounded flex flex-col justify-center">
  <h2 class="text-center text-accent text-2xl">Settings</h2>

  <label class="flex justify-between text-accent">
    Number of Colums <input v-model.number="config.cols" type="number" min="1" class="w-12 bg-transparent text-main"/>
  </label>
  <label class="flex justify-between text-accent">
    Number of Rows <input v-model.number="config.rows" type="number" min="1" class="w-12 bg-transparent text-main"/>
  </label>
  <label class="flex justify-between text-accent">
    Main text color <input v-model.number="config.colorMain" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between text-accent">
    Accented text color <input v-model.number="config.colorAccent" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between text-accent">
    Background color <input v-model.number="config.colorBg" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between text-accent">
    Widget background color <input v-model.number="config.colorBgBlock" type="color" class="bg-transparent"/>
  </label>
  <label class="flex justify-between text-accent">
    Border color <input v-model.number="config.colorBorder" type="color" class="bg-transparent"/>
  </label>
  <div class="flex justify-evenly p-2">
    <button class="px-4 py-2 rounded border border-main" @click="exportData">Export</button>
    <button class="px-4 py-2 rounded border border-main" @click="importData">Import</button>
  </div>
  <textarea v-model="data" v-show="data" class="border border-main p-2 bg-block resize-none"></textarea>
</div>`;
const component = {
    name: "ConfigEditor",
    components: { ClickableSVG },
    template,
    data() {
        return {
            data: "",
        };
    },
    computed: {
        config() {
            return this.$store.state.config;
        },
    },
    methods: {
        importData() {
            if (this.data) {
                try {
                    let newData = JSON.parse(this.data);
                    browser.storage.local.set(newData).then(_ => {
                        this.data = "";
                        this.$store.dispatch("restore");
                    });
                }
                catch (err) {
                    this.data = "Invalid data";
                }
            }
            else {
                // show the text box
                this.data = "paste the data here";
            }
        },
        exportData() {
            this.data = JSON.stringify(this.$store.state, null, 2);
        },
    },
};
export default component;
