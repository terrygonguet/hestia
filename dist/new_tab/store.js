export default new Vuex.Store({
    state: {
        config: {
            cols: 6,
            rows: 4,
            colorMain: "#000000",
            colorAccent: "#35acce",
            colorBg: "#ffffff",
            colorBgBlock: "#ffffff",
            colorBorder: "#454545",
        },
        widgets: [],
        titleWidget: {
            type: "Message",
            message: "Double click me!",
            messages: ["Enter to add"],
        },
    },
    mutations: {
        addWidget(state, create) {
            state.widgets.push(create());
        },
        deleteWidget(state, id) {
            state.widgets = state.widgets.filter(w => w.id != id);
        },
        reorderWidget(state, { id, delta }) {
            let l = state.widgets.length;
            let i = state.widgets.findIndex(w => w.id == id);
            let [widget] = state.widgets.splice(i, 1);
            i += delta;
            i = i < 0 ? 0 : i >= l ? l - 1 : i;
            state.widgets.splice(i, 0, widget);
        },
        newtab(state) {
            for (const widget of state.widgets) {
                if (widget.type != "TabCounter")
                    continue;
                let then = new Date(widget.lastAdd), now = new Date();
                // if it's a new day reset day counter
                if (then.getDate() != now.getDate())
                    widget.counters.today = 1;
                else
                    widget.counters.today++;
                widget.counters.allTime++;
                widget.lastAdd = Date.now();
            }
        },
    },
    actions: {
        async restore({ state }) {
            let data = await browser.storage.local.get(undefined);
            Object.assign(state.config, data.config);
            Object.assign(state.titleWidget, data.titleWidget);
            state.widgets = data.widgets || [];
        },
        async persist({ state }) {
            await browser.storage.local.set(clone(state));
        },
    },
    getters: {
        totalSpace(state) {
            return state.config.cols * state.config.rows;
        },
        usedSpace(state) {
            return state.widgets.reduce((acc, cur) => acc + cur.width * cur.height, 0);
        },
    },
});
